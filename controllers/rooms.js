import * as tb from '../services/tableService.js';

// Helper: nếu body.tags là chuỗi "a, b, c" -> ["a","b","c"]
function normalizeTags(body) {
  if (typeof body.tags === 'string') {
    const trimmed = body.tags.trim();
    body.tags = trimmed ? trimmed.split(',').map(s => s.trim()).filter(Boolean) : [];
  }
}

export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, 'rooms', '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
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

    // Chuyển visibility/type/tag/... giữ nguyên theo schema của bạn
    const data = await tb.insertItem(req.accessToken, 'rooms', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
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

    const data = await tb.updateById(req.accessToken, 'rooms', req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, 'rooms', req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
