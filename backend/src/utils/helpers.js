import crypto from 'crypto';

// 生成随机邀请码
export const generateInviteCode = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 生成唯一邀请码（检查数据库）
export const generateUniqueInviteCode = async (User) => {
  let code;
  let exists = true;

  while (exists) {
    code = generateInviteCode();
    const user = await User.findOne({ where: { inviteCode: code } });
    exists = !!user;
  }

  return code;
};

// 随机选择数组元素
export const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// 随机选择多个不重复元素
export const randomChoices = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 获取今天的日期字符串 YYYY-MM-DD
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// 检查是否是连续日期
export const isConsecutiveDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};
