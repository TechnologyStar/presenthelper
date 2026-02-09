import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RewardType = sequelize.define('RewardType', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  platform: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '平台名称，如：京东、话费等'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '面额'
  },
  requiredPoints: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'required_points',
    comment: '所需积分，为空表示只能通过卡组兑换'
  },
  requiredCardSetId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'required_card_set_id',
    comment: '所需卡组ID，为空表示只能通过积分兑换'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '兑换说明'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'reward_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const RewardCode = sequelize.define('RewardCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  typeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'type_id'
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('available', 'used', 'expired'),
    defaultValue: 'available',
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  },
  usedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'used_by'
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'used_at'
  }
}, {
  tableName: 'reward_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['type_id', 'status']
    }
  ]
});

const RedemptionRecord = sequelize.define('RedemptionRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  rewardTypeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'reward_type_id'
  },
  rewardCodeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'reward_code_id'
  },
  pointsCost: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'points_cost'
  }
}, {
  tableName: 'redemption_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 关联关系
RewardType.hasMany(RewardCode, { foreignKey: 'type_id', as: 'codes' });
RewardCode.belongsTo(RewardType, { foreignKey: 'type_id', as: 'rewardType' });

export { RewardType, RewardCode, RedemptionRecord };
