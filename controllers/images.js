// controllers/images.js
import * as tb from '../services/tableService.js';

const TABLE  = 'images';
const BUCKET = 'images';

// Chỉ giữ đúng các cột hiện có trong schema images
const ALLOWED_DB_FIELDS = new Set([
  'file_url',
  'width',
  'height',
  'title',
  'description',
  'room_id',
  // owner_id, created_at thường do RLS/DEFAULT xử lý; thêm nếu bạn muốn set thủ công
]);

const pickAllowed = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && ALLOWED_DB_FIELDS.has(k)) out[k] = v;
  }
  return out;
};

/** GET /images */
export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, TABLE, '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

/**
 * POST /images
 * - form-data có `file`: upload lên Storage, tạo URL (public hoặc signed tuỳ bucket), insert { file_url, ... }
 * - hoặc không có file nhưng có `file_url`: insert trực tiếp
 */
export const create = async (req, res, next) => {
  try {
    const hasFile = !!req.file;
    const hasDirectUrl = !!req.body?.file_url;

    if (!hasFile && !hasDirectUrl) {
      return res.status(400).json({ message: 'Provide a file ("file") or a "file_url".' });
    }

    // Kiểm tra bucket tồn tại
    const exists = await tb.ensureBucketExists(BUCKET);
    if (!exists) {
      return res.status(400).json({ message: `Storage bucket "${BUCKET}" does not exist.` });
    }

    // Lấy meta để biết bucket có Public không
    const meta = await tb.getBucketMeta(BUCKET);
    const isPublicBucket = !!meta?.public;

    // Trường hợp có upload file
    if (hasFile) {
      const file = req.file;
      const safeName = (file.originalname || 'upload.bin').replace(/[^\w.\-]/g, '_');
      const path = `${Date.now()}_${safeName}`;

      // Upload
      await tb.uploadToBucket(BUCKET, path, file.buffer, file.mimetype, true);

      // Lấy URL tuỳ theo bucket Public/Private
      const fileUrl = isPublicBucket
        ? tb.getPublicUrl(BUCKET, path)
        : await tb.createSignedUrl(BUCKET, path, 60 * 60 * 24 * 30); // 30 ngày

      // Build payload đúng cột schema
      const base = {
        file_url: fileUrl,
        // width/height nếu bạn muốn set từ client (req.body.width/height)
        // title, description, room_id từ req.body
      };
      const payload = pickAllowed({ ...base, ...req.body });

      const row = await tb.insertItem(req.accessToken, TABLE, payload);
      return res.status(201).json(row);
    }

    // Không upload, dùng sẵn file_url
    const payload = pickAllowed(req.body);
    if (!payload.file_url) {
      return res.status(400).json({ message: '"file_url" is required when no file is provided.' });
    }
    const row = await tb.insertItem(req.accessToken, TABLE, payload);
    return res.status(201).json(row);
  } catch (err) { next(err); }
};

/** PATCH /images/:id */
export const update = async (req, res, next) => {
  try {
    const patch = pickAllowed(req.body);
    const data = await tb.updateById(req.accessToken, TABLE, req.params.id, patch);
    res.json(data);
  } catch (err) { next(err); }
};

/** DELETE /images/:id */
export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, TABLE, req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
