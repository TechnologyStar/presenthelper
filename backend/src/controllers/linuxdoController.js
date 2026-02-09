import axios from 'axios';
import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { generateUniqueInviteCode } from '../utils/helpers.js';
import dotenv from 'dotenv';

dotenv.config();

const LINUXDO_CLIENT_ID = process.env.LINUXDO_CLIENT_ID;
const LINUXDO_CLIENT_SECRET = process.env.LINUXDO_CLIENT_SECRET;
const LINUXDO_REDIRECT_URI = process.env.LINUXDO_REDIRECT_URI;
const LINUXDO_AUTH_URL = process.env.LINUXDO_AUTH_URL;
const LINUXDO_TOKEN_URL = process.env.LINUXDO_TOKEN_URL;
const LINUXDO_USER_INFO_URL = process.env.LINUXDO_USER_INFO_URL;

export const getAuthUrl = (req, res) => {
  try {
    const params = new URLSearchParams({
      client_id: LINUXDO_CLIENT_ID,
      redirect_uri: LINUXDO_REDIRECT_URI,
      response_type: 'code',
      scope: 'user'
    });

    const authUrl = `${LINUXDO_AUTH_URL}?${params.toString()}`;

    res.json(successResponse({ authUrl }));
  } catch (error) {
    console.error('Get auth URL error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取授权链接失败'));
  }
};

export const handleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json(errorResponse(ERROR_CODES.VALIDATION_ERROR, '缺少授权码'));
    }

    const tokenData = await getAccessToken(code);

    if (!tokenData || !tokenData.access_token) {
      return res.status(400).json(errorResponse(ERROR_CODES.INVALID_CREDENTIALS, '获取访问令牌失败'));
    }

    const linuxdoUserInfo = await getUserInfo(tokenData.access_token);

    if (!linuxdoUserInfo || !linuxdoUserInfo.id) {
      return res.status(400).json(errorResponse(ERROR_CODES.INVALID_CREDENTIALS, '获取用户信息失败'));
    }

    let user = await User.findOne({ where: { linuxdoId: String(linuxdoUserInfo.id) } });

    const ip = req.ip || req.connection.remoteAddress;

    if (user) {
      await user.update({
        linuxdoUsername: linuxdoUserInfo.username,
        linuxdoAvatar: linuxdoUserInfo.avatar_template
          ? `https://connect.linux.do${linuxdoUserInfo.avatar_template.replace('{size}', '120')}`
          : null,
        linuxdoTrustLevel: linuxdoUserInfo.trust_level,
        lastLoginIp: ip,
        lastLoginAt: new Date()
      });
    } else {
      const inviteCode = await generateUniqueInviteCode(User);
      const username = linuxdoUserInfo.username || `linuxdo_${linuxdoUserInfo.id}`;

      user = await User.create({
        username,
        inviteCode,
        linuxdoId: String(linuxdoUserInfo.id),
        linuxdoUsername: linuxdoUserInfo.username,
        linuxdoAvatar: linuxdoUserInfo.avatar_template
          ? `https://connect.linux.do${linuxdoUserInfo.avatar_template.replace('{size}', '120')}`
          : null,
        linuxdoTrustLevel: linuxdoUserInfo.trust_level,
        lastLoginIp: ip,
        lastLoginAt: new Date()
      });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json(successResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        inviteCode: user.inviteCode,
        points: user.points,
        role: user.role,
        linuxdoUsername: user.linuxdoUsername,
        linuxdoAvatar: user.linuxdoAvatar,
        linuxdoTrustLevel: user.linuxdoTrustLevel
      }
    }, 'Linux Do 登录成功'));
  } catch (error) {
    console.error('Linux Do callback error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Linux Do 登录失败'));
  }
};

async function getAccessToken(code) {
  try {
    const params = new URLSearchParams({
      client_id: LINUXDO_CLIENT_ID,
      client_secret: LINUXDO_CLIENT_SECRET,
      code: code,
      redirect_uri: LINUXDO_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const response = await axios.post(LINUXDO_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get access token error:', error.response?.data || error.message);
    return null;
  }
}

async function getUserInfo(accessToken) {
  try {
    const response = await axios.get(LINUXDO_USER_INFO_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get user info error:', error.response?.data || error.message);
    return null;
  }
}
