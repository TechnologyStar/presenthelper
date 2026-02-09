import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InviteRecord = sequelize.define('InviteRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  inviterId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'inviter_id'
  },
  inviteeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'invitee_id'
  },
  isRewarded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_rewarded'
  },
  rewardedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'rewarded_at'
  }
}, {
  tableName: 'invite_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default InviteRecord;
