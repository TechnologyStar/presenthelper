import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const QuizSession = sequelize.define('QuizSession', {
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
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '题目ID数组'
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '用户答案数组'
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_passed'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'started_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  }
}, {
  tableName: 'quiz_sessions',
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

export default QuizSession;
