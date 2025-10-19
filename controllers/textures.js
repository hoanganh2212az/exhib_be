import * as tb from '../services/tableService.js';

export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, 'textures', '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await tb.insertItem(req.accessToken, 'textures', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await tb.updateById(req.accessToken, 'textures', req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, 'textures', req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
