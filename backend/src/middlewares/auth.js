import { verifyToken } from '../utils/jwt.js';
import { errorResponse, ERROR_CODES } from '../utils/response.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(errorResponse(ERROR_CODES.INVALID_TOKEN, 'Token 缺失'));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(errorResponse(ERROR_CODES.INVALID_TOKEN, 'Token 无效或已过期'));
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json(errorResponse(ERROR_CODES.INVALID_TOKEN, '用户不存在'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '认证失败'));
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(errorResponse(ERROR_CODES.PERMISSION_DENIED, '需要管理员权限'));
  }
  next();
};
