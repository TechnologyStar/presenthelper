import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cover_image'
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  xuexiUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'xuexi_url',
    comment: '学习强国链接'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'stories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const StoryRead = sequelize.define('StoryRead', {
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
  storyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'story_id'
  },
  isRewarded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_rewarded'
  }
}, {
  tableName: 'story_reads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'story_id']
    }
  ]
});

export { Story, StoryRead };
