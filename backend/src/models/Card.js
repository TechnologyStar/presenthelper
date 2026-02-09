import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CardSet = sequelize.define('CardSet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  theme: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  totalCards: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_cards'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'card_sets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  setId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'set_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'image_url'
  },
  rarity: {
    type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
    defaultValue: 'common',
    allowNull: false
  }
}, {
  tableName: 'cards',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const UserCard = sequelize.define('UserCard', {
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
  cardId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'card_id'
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  obtainedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'obtained_at'
  }
}, {
  tableName: 'user_cards',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'card_id']
    }
  ]
});

// 关联关系
CardSet.hasMany(Card, { foreignKey: 'set_id', as: 'cards' });
Card.belongsTo(CardSet, { foreignKey: 'set_id', as: 'cardSet' });

export { CardSet, Card, UserCard };
