import { User, Question, CardSet, Card, Story } from '../models/index.js';
import { generateUniqueInviteCode } from '../utils/helpers.js';

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    const adminInviteCode = await generateUniqueInviteCode(User);
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      phone: '13800138000',
      inviteCode: adminInviteCode,
      role: 'admin',
      points: 0
    });
    console.log('Admin user created:', admin.username);

    const questions = [
      {
        content: '中国共产党成立于哪一年？',
        type: 'single',
        options: [
          { key: 'A', value: '1919年' },
          { key: 'B', value: '1921年' },
          { key: 'C', value: '1927年' },
          { key: 'D', value: '1949年' }
        ],
        correctAnswer: 'B',
        tags: ['党史', '基础知识'],
        difficulty: 'easy'
      },
      {
        content: '新中国成立于哪一年？',
        type: 'single',
        options: [
          { key: 'A', value: '1945年' },
          { key: 'B', value: '1949年' },
          { key: 'C', value: '1950年' },
          { key: 'D', value: '1951年' }
        ],
        correctAnswer: 'B',
        tags: ['历史', '基础知识'],
        difficulty: 'easy'
      },
      {
        content: '中国特色社会主义进入新时代的标志是什么？',
        type: 'single',
        options: [
          { key: 'A', value: '党的十八大' },
          { key: 'B', value: '党的十九大' },
          { key: 'C', value: '党的二十大' },
          { key: 'D', value: '改革开放' }
        ],
        correctAnswer: 'B',
        tags: ['时政', '新时代'],
        difficulty: 'medium'
      },
      {
        content: '社会主义核心价值观包括哪些内容？（多选）',
        type: 'multiple',
        options: [
          { key: 'A', value: '富强、民主、文明、和谐' },
          { key: 'B', value: '自由、平等、公正、法治' },
          { key: 'C', value: '爱国、敬业、诚信、友善' },
          { key: 'D', value: '团结、进步、创新、发展' }
        ],
        correctAnswer: 'ABC',
        tags: ['价值观', '基础知识'],
        difficulty: 'medium'
      },
      {
        content: '中国共产党的根本宗旨是全心全意为人民服务。',
        type: 'judge',
        options: null,
        correctAnswer: 'true',
        tags: ['党的宗旨'],
        difficulty: 'easy'
      }
    ];

    for (const q of questions) {
      await Question.create(q);
    }
    console.log(`Created ${questions.length} questions`);

    const cardSet1 = await CardSet.create({
      name: '建党伟业',
      description: '纪念中国共产党成立的历史时刻',
      theme: '党史',
      totalCards: 5
    });

    const cards1 = [
      { name: '南湖红船', description: '中共一大会址', rarity: 'legendary' },
      { name: '井冈山', description: '革命根据地', rarity: 'epic' },
      { name: '延安宝塔', description: '革命圣地', rarity: 'epic' },
      { name: '遵义会议', description: '伟大转折', rarity: 'rare' },
      { name: '开国大典', description: '新中国成立', rarity: 'legendary' }
    ];

    for (const card of cards1) {
      await Card.create({
        setId: cardSet1.id,
        ...card
      });
    }
    console.log(`Created card set: ${cardSet1.name} with ${cards1.length} cards`);

    const cardSet2 = await CardSet.create({
      name: '改革开放',
      description: '中国特色社会主义道路探索',
      theme: '改革',
      totalCards: 5
    });

    const cards2 = [
      { name: '深圳特区', description: '改革开放窗口', rarity: 'rare' },
      { name: '浦东开发', description: '对外开放前沿', rarity: 'rare' },
      { name: '港澳回归', description: '一国两制', rarity: 'epic' },
      { name: '加入WTO', description: '融入世界', rarity: 'rare' },
      { name: '北京奥运', description: '大国崛起', rarity: 'epic' }
    ];

    for (const card of cards2) {
      await Card.create({
        setId: cardSet2.id,
        ...card
      });
    }
    console.log(`Created card set: ${cardSet2.name} with ${cards2.length} cards`);

    const stories = [
      {
        title: '红船精神',
        summary: '中国共产党的建党精神',
        content: '1921年7月，中国共产党第一次全国代表大会在浙江嘉兴南湖的一条游船上胜利闭幕，庄严宣告中国共产党的诞生。这条游船因而获得了一个永载中国革命史册的名字——红船。',
        xuexiUrl: 'https://www.xuexi.cn',
        isActive: true
      },
      {
        title: '长征精神',
        summary: '不怕牺牲、勇往直前的革命精神',
        content: '红军长征是人类历史上的伟大奇迹，中央红军共进行了380余次战斗，攻占700多座县城，红军牺牲了营以上干部多达430余人，平均年龄不到30岁。',
        xuexiUrl: 'https://www.xuexi.cn',
        isActive: true
      },
      {
        title: '延安精神',
        summary: '自力更生、艰苦奋斗的革命精神',
        content: '延安时期是中国共产党领导的中国革命事业从低潮走向高潮、实现历史性转折的时期。延安精神是中国共产党的传家宝，是中华民族宝贵的精神财富。',
        xuexiUrl: 'https://www.xuexi.cn',
        isActive: true
      }
    ];

    for (const story of stories) {
      await Story.create(story);
    }
    console.log(`Created ${stories.length} stories`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
