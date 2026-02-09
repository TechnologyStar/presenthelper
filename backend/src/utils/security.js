import xss from 'xss';
import validator from 'validator';

// XSS 防护配置
const xssOptions = {
  whiteList: {}, // 不允许任何HTML标签
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

// 消息内容安全过滤
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // 1. 移除所有HTML标签
  let cleaned = xss(message, xssOptions);

  // 2. 转义特殊字符
  cleaned = validator.escape(cleaned);

  // 3. 限制长度
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500);
  }

  // 4. 移除多余空白
  cleaned = cleaned.trim().replace(/\s+/g, ' ');

  return cleaned;
};

// 用户名安全验证
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // 只允许字母、数字、中文、下划线
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/;
  return usernameRegex.test(username);
};

// SQL注入防护 - 参数化查询验证
export const validateSQLParam = (param) => {
  if (param === null || param === undefined) {
    return true;
  }

  const paramStr = String(param);

  // 检测常见SQL注入模式
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /(\bOR\b.*=.*|1=1|'=')/i,
    /(\bUNION\b.*\bSELECT\b)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(paramStr)) {
      return false;
    }
  }

  return true;
};

// 敏感词过滤
const sensitiveWords = [
  '暴力', '色情', '赌博', '毒品', '反动',
  // 可以添加更多敏感词
];

export const filterSensitiveWords = (text) => {
  let filtered = text;

  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });

  return filtered;
};

// 频率限制检查
const messageHistory = new Map();

export const checkMessageFrequency = (userId, maxMessages = 10, timeWindow = 60000) => {
  const now = Date.now();
  const userHistory = messageHistory.get(userId) || [];

  // 清理过期记录
  const recentMessages = userHistory.filter(timestamp => now - timestamp < timeWindow);

  if (recentMessages.length >= maxMessages) {
    return false;
  }

  recentMessages.push(now);
  messageHistory.set(userId, recentMessages);

  return true;
};

// 清理过期的频率限制记录
setInterval(() => {
  const now = Date.now();
  for (const [userId, history] of messageHistory.entries()) {
    const recentMessages = history.filter(timestamp => now - timestamp < 60000);
    if (recentMessages.length === 0) {
      messageHistory.delete(userId);
    } else {
      messageHistory.set(userId, recentMessages);
    }
  }
}, 60000);

export default {
  sanitizeMessage,
  validateUsername,
  validateSQLParam,
  filterSensitiveWords,
  checkMessageFrequency
};
