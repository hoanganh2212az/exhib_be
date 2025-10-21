// controllers/rooms.js
import * as tb from '../services/tableService.js';
import { supabaseAdmin } from '../config/supabase.js'; // NEW

const BUCKET = 'roomjson';

// Helper: nếu body.tags là chuỗi "a, b, c" -> ["a","b","c"]
function normalizeTags(body) {
  if (typeof body.tags === 'string') {
    const trimmed = body.tags.trim();
    body.tags = trimmed ? trimmed.split(',').map(s => s.trim()).filter(Boolean) : [];
  }
}

// Upload buffer JSON lên Supabase Storage, trả { path, publicUrl }
async function uploadRoomJSONToStorage(owner_id, slugOrId, file) {
  // file: Multer file { originalname, buffer, mimetype... }
  const safeSlug = (slugOrId || 'room').toString().replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
  const filename = `${Date.now()}_${safeSlug}.json`;
  const filepath = `${owner_id}/${filename}`;

  const up = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filepath, file.buffer, { contentType: 'application/json', upsert: false });

  if (up.error) throw up.error;

  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filepath);
  return { path: filepath, publicUrl: pub?.publicUrl || null };
}

export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, 'rooms', '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    let storageMeta = null;

    // Nếu người dùng gửi form-data có file room_json
    if (req.file) {
      try {
        const text = req.file.buffer.toString('utf8');
        req.body.room_json = JSON.parse(text); // Supabase JSONB cần object hợp lệ
      } catch (e) {
        e.status = 400;
        e.message = 'room_json file must be valid JSON';
        throw e;
      }
    }

    normalizeTags(req.body);

    // Lưu DB trước (giống cũ)
    const created = await tb.insertItem(req.accessToken, 'rooms', req.body);

    // Nếu có file thì upload bản gốc lên Storage (bucket roomjson)
    if (req.file) {
      const owner_id = req.user?.id || req.body.owner_id || created?.owner_id;
      if (!owner_id) {
        // Không có owner_id thì bỏ qua upload Storage (tránh crash), bạn có thể đổi thành bắt buộc nếu muốn
        // throw new Error('owner_id is required to upload to Storage');
      } else {
        const slugOrId = created?.slug || created?.id;
        storageMeta = await uploadRoomJSONToStorage(owner_id, slugOrId, req.file);
      }
    }

    // Trả về như cũ + đính kèm meta Storage (chỉ ở response, không ghi DB để khỏi thay đổi schema)
    res.status(201).json({
      ...created,
      __storage: storageMeta, // { path, publicUrl } | null
    });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    let storageMeta = null;

    if (req.file) {
      try {
        const text = req.file.buffer.toString('utf8');
        req.body.room_json = JSON.parse(text);
      } catch (e) {
        e.status = 400;
        e.message = 'room_json file must be valid JSON';
        throw e;
      }
    }

    normalizeTags(req.body);

    const updated = await tb.updateById(req.accessToken, 'rooms', req.params.id, req.body);

    // Nếu có file mới, upload bản gốc lên Storage
    if (req.file) {
      const owner_id = req.user?.id || req.body.owner_id || updated?.owner_id;
      if (owner_id) {
        const slugOrId = updated?.slug || updated?.id || req.params.id;
        storageMeta = await uploadRoomJSONToStorage(owner_id, slugOrId, req.file);
      }
    }

    res.json({
      ...updated,
      __storage: storageMeta,
    });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, 'rooms', req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
