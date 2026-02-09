import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_time'
  },
  rules: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '活动规则配置'
  },
  rewards: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '奖励配置'
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'ended'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const EventParticipation = sequelize.define('EventParticipation', {
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
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'event_id'
  },
  progress: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '任务进度'
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_completed'
  },
  rewardedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'rewarded_at'
  }
}, {
  tableName: 'event_participations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export { Event, EventParticipation };
