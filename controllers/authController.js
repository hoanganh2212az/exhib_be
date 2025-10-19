import * as svc from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await svc.signup({ email, password });
    res.status(201).json(data);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await svc.login({ email, password });
    res.json(data);
  } catch (err) { next(err); }
};

export const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const data = await svc.refresh({ refresh_token });
    res.json(data);
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
    const data = await svc.logout(token);
    res.json(data);
  } catch (err) { next(err); }
};
