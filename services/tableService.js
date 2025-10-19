// Generic PostgREST-like helpers via Supabase JS
import { getUserClient, supabaseAdmin } from '../config/supabase.js';

const byToken = (token) => getUserClient(token);

export const listItems = async (token, table, select='*', queryBuilder=(q)=>q) => {
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

// Admin-only ops for tables that require service role (e.g., creating users row)
// Use with caution; ensure RLS policies!
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
