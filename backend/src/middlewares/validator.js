import Joi from 'joi';
import { errorResponse, ERROR_CODES } from '../utils/response.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json(errorResponse(ERROR_CODES.VALIDATION_ERROR, '数据验证失败', errors));
    }

    next();
  };
};

export const schemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.min': '用户名至少3个字符',
      'string.max': '用户名最多50个字符',
      'any.required': '用户名不能为空'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': '密码至少6个字符',
      'any.required': '密码不能为空'
    }),
    phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required().messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
    inviteCode: Joi.string().length(8).optional()
  }),

  login: Joi.object({
    username: Joi.string().required().messages({
      'any.required': '用户名不能为空'
    }),
    password: Joi.string().required().messages({
      'any.required': '密码不能为空'
    })
  })
};
