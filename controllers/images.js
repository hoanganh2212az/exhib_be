// controllers/images.js
import * as tb from '../services/tableService.js';

const TABLE = 'images';
const BUCKET = 'images';

/**
 * GET /images
 */
export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, TABLE, '*', (q) => q);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /images
 * - Nếu có `req.file` (multipart/form-data với field "file"):
 *     1) Upload vào Supabase Storage bucket "images"
 *     2) Lấy public URL -> map vào cột `file_url` (NOT NULL)
 *     3) Insert DB cùng các field text khác trong req.body
 * - Nếu KHÔNG có file nhưng có `req.body.file_url`: insert thẳng DB
 */
export const create = async (req, res, next) => {
  try {
    const hasFile = !!req.file;
    const hasDirectUrl = !!req.body?.file_url;

    // Trường hợp không có file và cũng không có file_url
    if (!hasFile && !hasDirectUrl) {
      return res.status(400).json({
        message: 'Provide a file (field "file") or a non-empty "file_url".'
      });
    }

    // Nếu có file: ưu tiên upload & dùng URL từ Storage
    if (hasFile) {
      const file = req.file;

      const safeName =
        (file.originalname || 'upload.bin').replace(/[^\w.\-]/g, '_');
      const path = `${Date.now()}_${safeName}`;

      // 1) Upload vào Storage (service role)
      const uploaded = await tb.uploadToBucket(
        BUCKET,
        path,
        file.buffer,
        file.mimetype,
        true // upsert
      );

      // 2) Lấy public URL
      const publicUrl = tb.getPublicUrl(BUCKET, uploaded.path);

      // 3) Insert bản ghi DB (đảm bảo có file_url)
      const payload = {
        file_url: publicUrl,           // tên cột NOT NULL trong DB
        storage_path: uploaded.path,   // đổi tên nếu bảng bạn dùng cột khác (vd: path)
        mime_type: file.mimetype,
        size: file.size,
        original_name: file.originalname,
        ...req.body                    // title, description, room_id, ...
      };

      const row = await tb.insertItem(req.accessToken, TABLE, payload);
      return res.status(201).json(row);
    }

    // Nếu không có file nhưng có sẵn file_url -> chèn DB trực tiếp
    const row = await tb.insertItem(req.accessToken, TABLE, req.body);
    return res.status(201).json(row);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /images/:id
 */
export const update = async (req, res, next) => {
  try {
    const data = await tb.updateById(
      req.accessToken,
      TABLE,
      req.params.id,
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /images/:id
 */
export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, TABLE, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
