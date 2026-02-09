import { User, InviteRecord, Card, UserCard } from '../models/index.js';
import { successResponse, errorResponse, ERROR_CODES } from '../utils/response.js';
import { randomChoices } from '../utils/helpers.js';

// 获取我的邀请信息
export const getMyInvites = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取邀请记录
    const invites = await InviteRecord.findAll({
      where: { inviterId: userId },
      include: [{
        model: User,
        as: 'invitee',
        attributes: ['id', 'username', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    // 统计信息
    const totalInvites = invites.length;
    const rewardedInvites = invites.filter(i => i.isRewarded).length;

    res.json(successResponse({
      totalInvites,
      rewardedInvites,
      invites: invites.map(invite => ({
        id: invite.id,
        invitee: {
          username: invite.invitee.username,
          joinedAt: invite.invitee.createdAt
        },
        isRewarded: invite.isRewarded,
        rewardedAt: invite.rewardedAt,
        createdAt: invite.createdAt
      }))
    }));
  } catch (error) {
    console.error('Get my invites error:', error);
    res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_ERROR, '获取邀请记录失败'));
  }
};

// 处理邀请奖励（内部方法，在用户完成首次答题时调用）
export const processInviteReward = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.invitedBy) {
      return;
    }

    // 查找邀请记录
    const inviteRecord = await InviteRecord.findOne({
      where: {
        inviterId: user.invitedBy,
        inviteeId: userId,
        isRewarded: false
      }
    });

    if (!inviteRecord) {
      return;
    }

    // 发放奖励：2张随机卡片
    const allCards = await Card.findAll();
    if (allCards.length > 0) {
      const rewardCards = randomChoices(allCards, Math.min(2, allCards.length));

      for (const card of rewardCards) {
        const [userCard, created] = await UserCard.findOrCreate({
          where: { userId: user.invitedBy, cardId: card.id },
          defaults: {
            count: 1,
            obtainedAt: new Date()
          }
        });

        if (!created) {
          await userCard.increment('count');
        }
      }
    }

    // 增加邀请者积分
    await User.increment('points', { by: 20, where: { id: user.invitedBy } });

    // 标记奖励已发放
    await inviteRecord.update({
      isRewarded: true,
      rewardedAt: new Date()
    });

    console.log(`Invite reward processed for user ${user.invitedBy}`);
  } catch (error) {
    console.error('Process invite reward error:', error);
  }
};
