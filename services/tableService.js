// services/tableService.js
// Generic PostgREST-like helpers via Supabase JS
import { getUserClient, supabaseAdmin } from '../config/supabase.js';

const byToken = (token) => getUserClient(token);

/* -------------------- BASIC CRUD (RLS qua user token) -------------------- */
export const listItems = async (token, table, select = '*', queryBuilder = (q) => q) => {
  const db = byToken(token);
  let q = db.from(table).select(select);
  q = queryBuilder(q);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

export const insertItem = async (token, table, payload) => {
  const db = byToken(token);
  const { data, error } = await db.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateById = async (token, table, id, patch) => {
  const db = byToken(token);
  const { data, error } = await db.from(table).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteById = async (token, table, id) => {
  const db = byToken(token);
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) throw error;
  return { ok: true };
};

/* -------------------- ADMIN TABLE OPS (service role) -------------------- */
export const adminInsert = async (table, payload) => {
  const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const adminUpdateById = async (table, id, patch) => {
  const { data, error } = await supabaseAdmin.from(table).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const adminDeleteById = async (table, id) => {
  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
  if (error) throw error;
  return { ok: true };
};

/* -------------------- STORAGE HELPERS (service role) -------------------- */
export const uploadToBucket = async (bucket, path, fileBuffer, contentType, upsert = false) => {
  const { data, error } = await supabaseAdmin
    .storage
    .from(bucket)
    .upload(path, fileBuffer, { contentType, upsert });
  if (error) throw error;
  // data: { path, fullPath? }
  return data;
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const removeFromBucket = async (bucket, paths) => {
  // paths: string | string[]
  const list = Array.isArray(paths) ? paths : [paths];
  const { data, error } = await supabaseAdmin.storage.from(bucket).remove(list);
  if (error) throw error;
  return data;
};
