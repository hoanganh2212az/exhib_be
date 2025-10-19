import * as tb from '../services/tableService.js';

export const list = async (req, res, next) => {
  try {
    const data = await tb.listItems(req.accessToken, 'room_collaborators', '*', (q) => q);
    res.json(data);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await tb.insertItem(req.accessToken, 'room_collaborators', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await tb.updateById(req.accessToken, 'room_collaborators', req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const data = await tb.deleteById(req.accessToken, 'room_collaborators', req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};
