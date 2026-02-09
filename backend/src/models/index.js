import User from './User.js';
import Question from './Question.js';
import QuizSession from './QuizSession.js';
import { CardSet, Card, UserCard } from './Card.js';
import CheckIn from './CheckIn.js';
import InviteRecord from './InviteRecord.js';
import { Story, StoryRead } from './Story.js';
import { RewardType, RewardCode, RedemptionRecord } from './Reward.js';
import { Event, EventParticipation } from './Event.js';

// 定义关联关系
User.hasMany(QuizSession, { foreignKey: 'user_id', as: 'quizSessions' });
QuizSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserCard, { foreignKey: 'user_id', as: 'userCards' });
UserCard.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserCard.belongsTo(Card, { foreignKey: 'card_id', as: 'card' });
Card.hasMany(UserCard, { foreignKey: 'card_id', as: 'userCards' });

User.hasMany(CheckIn, { foreignKey: 'user_id', as: 'checkIns' });
CheckIn.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(InviteRecord, { foreignKey: 'inviter_id', as: 'invitations' });
User.hasMany(InviteRecord, { foreignKey: 'invitee_id', as: 'invitedRecords' });
InviteRecord.belongsTo(User, { foreignKey: 'inviter_id', as: 'inviter' });
InviteRecord.belongsTo(User, { foreignKey: 'invitee_id', as: 'invitee' });

User.hasMany(StoryRead, { foreignKey: 'user_id', as: 'storyReads' });
StoryRead.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
StoryRead.belongsTo(Story, { foreignKey: 'story_id', as: 'story' });
Story.hasMany(StoryRead, { foreignKey: 'story_id', as: 'reads' });

User.hasMany(RedemptionRecord, { foreignKey: 'user_id', as: 'redemptions' });
RedemptionRecord.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
RedemptionRecord.belongsTo(RewardType, { foreignKey: 'reward_type_id', as: 'rewardType' });
RedemptionRecord.belongsTo(RewardCode, { foreignKey: 'reward_code_id', as: 'rewardCode' });

User.hasMany(EventParticipation, { foreignKey: 'user_id', as: 'eventParticipations' });
EventParticipation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
EventParticipation.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Event.hasMany(EventParticipation, { foreignKey: 'event_id', as: 'participations' });

export {
  User,
  Question,
  QuizSession,
  CardSet,
  Card,
  UserCard,
  CheckIn,
  InviteRecord,
  Story,
  StoryRead,
  RewardType,
  RewardCode,
  RedemptionRecord,
  Event,
  EventParticipation
};
