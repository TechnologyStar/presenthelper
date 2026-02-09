import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CheckIn = sequelize.define('CheckIn', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  consecutiveDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    field: 'consecutive_days'
  },
  rewardCardId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'reward_card_id'
  }
}, {
  tableName: 'check_ins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date']
    }
  ]
});

export default CheckIn;
