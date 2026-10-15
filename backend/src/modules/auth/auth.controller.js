const { validate, registerSchema, loginSchema, refreshSchema } = require("./auth.schemas");
const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const input = validate(registerSchema, req.body);
    const result = await authService.register(input);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const input = validate(loginSchema, req.body);
    const result = await authService.login(input);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = validate(refreshSchema, req.body);
    const result = await authService.refresh(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = validate(refreshSchema, req.body);
    await authService.logout(refreshToken);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function logoutAll(req, res, next) {
  try {
    await authService.logoutAll(req.user._id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }

}

async function clerkSync(req, res, next) {
  try {
    const result = await authService.syncClerkUser(req.clerkUser);
    console.info(`User synced: ${req.clerkUser.email} via ${req.clerkUser.provider}`);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.status(200).json({ user: req.user.toPublicJSON() });
}

module.exports = { register, login, refresh, logout, logoutAll, clerkSync, me };
