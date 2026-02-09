export const successResponse = (data = null, message = 'Success') => {
  return {
    success: true,
    code: 0,
    message,
    data
  };
};

export const errorResponse = (code, message, data = null) => {
  return {
    success: false,
    code,
    message,
    data
  };
};

export const ERROR_CODES = {
  // 用户相关 1xxx
  USERNAME_EXISTS: 1001,
  INVALID_CREDENTIALS: 1002,
  ACCOUNT_LOCKED: 1003,
  INVALID_TOKEN: 1004,
  PHONE_EXISTS: 1005,

  // 答题相关 2xxx
  ALREADY_ANSWERED_TODAY: 2001,
  ANSWER_TIME_TOO_SHORT: 2002,
  QUESTION_NOT_FOUND: 2003,
  QUIZ_SESSION_NOT_FOUND: 2004,

  // 签到相关 3xxx
  ALREADY_CHECKED_IN: 3001,

  // 奖励相关 4xxx
  INSUFFICIENT_POINTS: 4001,
  CARD_SET_NOT_COMPLETE: 4002,
  REWARD_OUT_OF_STOCK: 4003,
  REWARD_TYPE_NOT_FOUND: 4004,

  // 频率限制 5xxx
  RATE_LIMIT_EXCEEDED: 5001,
  IP_BLOCKED: 5002,

  // 通用错误 9xxx
  VALIDATION_ERROR: 9001,
  PERMISSION_DENIED: 9002,
  RESOURCE_NOT_FOUND: 9003,
  INTERNAL_ERROR: 9999
};
