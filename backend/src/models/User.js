import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: true,
    unique: true
  },
  inviteCode: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
    field: 'invite_code'
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'invited_by'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'login_attempts'
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lock_until'
  },
  lastLoginIp: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'last_login_ip'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at'
  },
  linuxdoId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    field: 'linuxdo_id',
    comment: 'Linux Do 用户唯一标识'
  },
  linuxdoUsername: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'linuxdo_username',
    comment: 'Linux Do 用户名'
  },
  linuxdoAvatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'linuxdo_avatar',
    comment: 'Linux Do 用户头像'
  },
  linuxdoTrustLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'linuxdo_trust_level',
    comment: 'Linux Do 信任等级'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 密码加密钩子
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// 实例方法：验证密码
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：检查账号是否锁定
User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// 实例方法：增加登录失败次数
User.prototype.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.update({
      loginAttempts: 1,
      lockUntil: null
    });
  }

  const updates = { loginAttempts: this.loginAttempts + 1 };
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;

  if (this.loginAttempts + 1 >= maxAttempts) {
    const lockTime = parseInt(process.env.LOCK_TIME) || 30;
    updates.lockUntil = Date.now() + lockTime * 60 * 1000;
  }

  return await this.update(updates);
};

// 实例方法：重置登录失败次数
User.prototype.resetLoginAttempts = async function() {
  return await this.update({
    loginAttempts: 0,
    lockUntil: null
  });
};

export default User;
