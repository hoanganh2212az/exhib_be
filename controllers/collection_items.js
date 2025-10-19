import * as tb from '../services/tableService.js';

export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, 'collection_items', '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await tb.insertItem(req.accessToken, 'collection_items', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await tb.updateById(req.accessToken, 'collection_items', req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, 'collection_items', req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
