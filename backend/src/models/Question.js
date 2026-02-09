import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('single', 'multiple', 'judge'),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '选项数组，格式: [{key: "A", value: "选项内容"}]'
  },
  correctAnswer: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'correct_answer',
    comment: '正确答案，如: A 或 AB 或 true'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '知识点标签数组'
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Question;
