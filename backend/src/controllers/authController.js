import { User, InviteRecord } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { generateUniqueInviteCode } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const { username, password, phone, inviteCode } = req.body;

    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json(errorResponse(ERROR_CODES.USERNAME_EXISTS, '用户名已存在'));
    }

    const existingPhone = await User.findOne({
      where: { phone }
    });

    if (existingPhone) {
      return res.status(400).json(errorResponse(ERROR_CODES.PHONE_EXISTS, '手机号已注册'));
    }

    let invitedBy = null;
    if (inviteCode) {
      const inviter = await User.findOne({ where: { inviteCode } });
      if (inviter) {
        invitedBy = inviter.id;
      }
    }

    const userInviteCode = await generateUniqueInviteCode(User);

    const user = await User.create({
      username,
      password,
      phone,
      inviteCode: userInviteCode,
      invitedBy
    });

    if (invitedBy) {
      await InviteRecord.create({
        inviterId: invitedBy,
        inviteeId: user.id
      });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(201).json(successResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        inviteCode: user.inviteCode,
        points: user.points,
        role: user.role
      }
    }, '注册成功'));
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '注册失败'));
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json(errorResponse(ERROR_CODES.INVALID_CREDENTIALS, '用户名或密码错误'));
    }

    if (user.isLocked()) {
      return res.status(403).json(errorResponse(ERROR_CODES.ACCOUNT_LOCKED, '账号已锁定，请30分钟后再试'));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json(errorResponse(ERROR_CODES.INVALID_CREDENTIALS, '用户名或密码错误'));
    }

    await user.resetLoginAttempts();
    await user.update({
      lastLoginIp: ip,
      lastLoginAt: new Date()
    });

    const token = generateToken({ userId: user.id, role: user.role });

    res.json(successResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        inviteCode: user.inviteCode,
        points: user.points,
        role: user.role
      }
    }, '登录成功'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '登录失败'));
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json(successResponse({
      id: user.id,
      username: user.username,
      phone: user.phone,
      inviteCode: user.inviteCode,
      points: user.points,
      role: user.role,
      createdAt: user.createdAt
    }));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取用户信息失败'));
  }
};
