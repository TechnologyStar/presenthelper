import { Question, CardSet, Card, Story } from './models/index.js';

// 红色题目数据
const questions = [
  // 党史类题目
  {
    content: '中国共产党成立于哪一年？',
    type: 'single',
    options: ['1919年', '1921年', '1923年', '1927年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['党史', '建党']
  },
  {
    content: '中国共产党第一次全国代表大会在哪里召开？',
    type: 'single',
    options: ['北京', '上海', '广州', '南京'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['党史', '建党']
  },
  {
    content: '遵义会议召开于哪一年？',
    type: 'single',
    options: ['1934年', '1935年', '1936年', '1937年'],
    correctAnswer: 'B',
    difficulty: 'medium',
    tags: ['党史', '长征']
  },
  {
    content: '新中国成立于哪一年？',
    type: 'single',
    options: ['1945年', '1949年', '1950年', '1951年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['国史', '建国']
  },
  {
    content: '中国共产党的根本宗旨是什么？',
    type: 'single',
    options: ['实现共产主义', '全心全意为人民服务', '发展生产力', '建设社会主义'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['党史', '党章']
  },
  {
    content: '党的十九大提出的"两个一百年"奋斗目标是什么？（多选）',
    type: 'multiple',
    options: [
      '建党一百年时全面建成小康社会',
      '建国一百年时建成富强民主文明和谐美丽的社会主义现代化强国',
      '改革开放一百年时实现共同富裕',
      '新中国成立一百年时成为世界第一强国'
    ],
    correctAnswer: 'AB',
    difficulty: 'medium',
    tags: ['新时代', '党的目标']
  },
  {
    content: '长征途中，红军爬过的雪山不包括以下哪座？',
    type: 'single',
    options: ['夹金山', '梦笔山', '泰山', '岷山'],
    correctAnswer: 'C',
    difficulty: 'medium',
    tags: ['党史', '长征']
  },
  {
    content: '抗日战争全面爆发的标志性事件是？',
    type: 'single',
    options: ['九一八事变', '七七事变', '八一三事变', '西安事变'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['国史', '抗战']
  },
  {
    content: '中国人民解放军的建军节是哪一天？',
    type: 'single',
    options: ['7月1日', '8月1日', '10月1日', '12月1日'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['军史', '建军节']
  },
  {
    content: '改革开放是从哪一年开始的？',
    type: 'single',
    options: ['1976年', '1978年', '1980年', '1982年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['改革开放', '国史']
  },
  {
    content: '邓小平提出的"一国两制"构想最初是为了解决什么问题？',
    type: 'single',
    options: ['香港问题', '澳门问题', '台湾问题', '西藏问题'],
    correctAnswer: 'C',
    difficulty: 'medium',
    tags: ['改革开放', '统一']
  },
  {
    content: '中国特色社会主义进入新时代的重大判断是在党的哪次代表大会上提出的？',
    type: 'single',
    options: ['十七大', '十八大', '十九大', '二十大'],
    correctAnswer: 'C',
    difficulty: 'medium',
    tags: ['新时代', '党史']
  },
  {
    content: '五四运动发生于哪一年？',
    type: 'single',
    options: ['1917年', '1919年', '1921年', '1923年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['国史', '五四运动']
  },
  {
    content: '红军长征的起点是？',
    type: 'single',
    options: ['江西瑞金', '福建长汀', '湖南通道', '贵州遵义'],
    correctAnswer: 'A',
    difficulty: 'medium',
    tags: ['党史', '长征']
  },
  {
    content: '中国共产党的第一个纲领是在哪次会议上通过的？',
    type: 'single',
    options: ['一大', '二大', '三大', '四大'],
    correctAnswer: 'A',
    difficulty: 'medium',
    tags: ['党史', '党章']
  },
  {
    content: '以下哪些是社会主义核心价值观的内容？（多选）',
    type: 'multiple',
    options: ['富强', '民主', '文明', '和谐'],
    correctAnswer: 'ABCD',
    difficulty: 'easy',
    tags: ['新时代', '价值观']
  },
  {
    content: '抗美援朝战争开始于哪一年？',
    type: 'single',
    options: ['1949年', '1950年', '1951年', '1952年'],
    correctAnswer: 'B',
    difficulty: 'medium',
    tags: ['军史', '抗美援朝']
  },
  {
    content: '中国第一颗原子弹爆炸成功是在哪一年？',
    type: 'single',
    options: ['1962年', '1964年', '1966年', '1968年'],
    correctAnswer: 'B',
    difficulty: 'medium',
    tags: ['国史', '科技']
  },
  {
    content: '香港回归祖国是在哪一年？',
    type: 'single',
    options: ['1995年', '1997年', '1999年', '2000年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['国史', '统一']
  },
  {
    content: '澳门回归祖国是在哪一年？',
    type: 'single',
    options: ['1997年', '1998年', '1999年', '2000年'],
    correctAnswer: 'C',
    difficulty: 'easy',
    tags: ['国史', '统一']
  },
  {
    content: '中国加入世界贸易组织（WTO）是在哪一年？',
    type: 'single',
    options: ['1999年', '2000年', '2001年', '2002年'],
    correctAnswer: 'C',
    difficulty: 'medium',
    tags: ['改革开放', '国史']
  },
  {
    content: '北京奥运会举办于哪一年？',
    type: 'single',
    options: ['2006年', '2008年', '2010年', '2012年'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['国史', '体育']
  },
  {
    content: '党的群众路线教育实践活动的主要内容是反对哪"四风"？（多选）',
    type: 'multiple',
    options: ['形式主义', '官僚主义', '享乐主义', '奢靡之风'],
    correctAnswer: 'ABCD',
    difficulty: 'medium',
    tags: ['新时代', '党建']
  },
  {
    content: '中国梦的本质是什么？（多选）',
    type: 'multiple',
    options: ['国家富强', '民族振兴', '人民幸福', '世界和平'],
    correctAnswer: 'ABC',
    difficulty: 'medium',
    tags: ['新时代', '中国梦']
  },
  {
    content: '井冈山革命根据地是由谁创建的？',
    type: 'single',
    options: ['毛泽东', '周恩来', '朱德', '刘少奇'],
    correctAnswer: 'A',
    difficulty: 'easy',
    tags: ['党史', '革命根据地']
  },
  {
    content: '延安整风运动的主要内容是反对什么？（多选）',
    type: 'multiple',
    options: ['主观主义', '宗派主义', '党八股', '官僚主义'],
    correctAnswer: 'ABC',
    difficulty: 'hard',
    tags: ['党史', '延安']
  },
  {
    content: '三大战役不包括以下哪个？',
    type: 'single',
    options: ['辽沈战役', '淮海战役', '平津战役', '渡江战役'],
    correctAnswer: 'D',
    difficulty: 'medium',
    tags: ['军史', '解放战争']
  },
  {
    content: '中国第一个五年计划的时间是？',
    type: 'single',
    options: ['1949-1954年', '1950-1955年', '1953-1957年', '1954-1958年'],
    correctAnswer: 'C',
    difficulty: 'hard',
    tags: ['国史', '经济建设']
  },
  {
    content: '党的十八大以来，以习近平同志为核心的党中央提出的"四个全面"战略布局是什么？（多选）',
    type: 'multiple',
    options: [
      '全面建成小康社会',
      '全面深化改革',
      '全面依法治国',
      '全面从严治党'
    ],
    correctAnswer: 'ABCD',
    difficulty: 'medium',
    tags: ['新时代', '战略布局']
  },
  {
    content: '雷锋精神的核心是什么？',
    type: 'single',
    options: ['艰苦奋斗', '全心全意为人民服务', '爱岗敬业', '无私奉献'],
    correctAnswer: 'B',
    difficulty: 'easy',
    tags: ['精神文明', '榜样']
  }
];

// 卡组数据
const cardSets = [
  {
    name: '开国元勋',
    description: '新中国的缔造者们，他们为中华民族的独立和解放作出了不朽贡献',
    theme: '党史',
    cards: [
      {
        name: '毛泽东',
        description: '中华人民共和国开国领袖，伟大的马克思主义者',
        rarity: 'legendary',
        imageUrl: ''
      },
      {
        name: '周恩来',
        description: '新中国第一任总理，杰出的无产阶级革命家',
        rarity: 'legendary',
        imageUrl: ''
      },
      {
        name: '朱德',
        description: '中国人民解放军主要缔造者之一',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '刘少奇',
        description: '伟大的马克思主义者，党和国家主要领导人',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '邓小平',
        description: '改革开放的总设计师',
        rarity: 'legendary',
        imageUrl: ''
      }
    ]
  },
  {
    name: '革命圣地',
    description: '中国革命历程中的重要地标，见证了党的光辉历史',
    theme: '国史',
    cards: [
      {
        name: '井冈山',
        description: '中国革命的摇篮',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '延安',
        description: '中国革命的圣地',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '西柏坡',
        description: '新中国从这里走来',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '遵义',
        description: '伟大转折的发生地',
        rarity: 'epic',
        imageUrl: ''
      }
    ]
  },
  {
    name: '英雄模范',
    description: '新中国成立以来涌现的英雄人物，他们的事迹激励着一代又一代人',
    theme: '新时代',
    cards: [
      {
        name: '雷锋',
        description: '全心全意为人民服务的楷模',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '焦裕禄',
        description: '县委书记的榜样',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '钱学森',
        description: '中国航天之父',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '袁隆平',
        description: '杂交水稻之父',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '屠呦呦',
        description: '诺贝尔生理学或医学奖获得者',
        rarity: 'epic',
        imageUrl: ''
      }
    ]
  },
  {
    name: '改革开放',
    description: '改革开放以来的重大成就和历史时刻',
    theme: '改革开放',
    cards: [
      {
        name: '深圳特区',
        description: '改革开放的窗口',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '香港回归',
        description: '1997年7月1日',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '澳门回归',
        description: '1999年12月20日',
        rarity: 'epic',
        imageUrl: ''
      },
      {
        name: '加入WTO',
        description: '2001年12月11日',
        rarity: 'rare',
        imageUrl: ''
      },
      {
        name: '北京奥运',
        description: '2008年8月8日',
        rarity: 'rare',
        imageUrl: ''
      }
    ]
  }
];

// 红色故事数据
const stories = [
  {
    title: '红军长征的伟大壮举',
    coverImage: '',
    summary: '长征是人类历史上的伟大奇迹，中央红军共进行了380余次战斗，攻占700多座县城，红军牺牲了营以上干部多达430余人，平均年龄不到30岁。',
    content: `1934年10月，中央红军主力离开中央革命根据地，开始长征。长征途中，红军突破敌人四道封锁线，渡过湘江时，中央红军和中央机关人员由出发时的8万多人锐减至3万余人。

1935年1月，中共中央在遵义召开政治局扩大会议，确立了毛泽东在党中央和红军的领导地位，在极其危急的情况下挽救了党，挽救了红军，挽救了中国革命。

红军四渡赤水，巧渡金沙江，强渡大渡河，飞夺泸定桥，翻越夹金山，走过茫茫草地，历经千辛万苦，于1935年10月到达陕北，胜利完成了震惊世界的长征。

长征的胜利，宣告了国民党反动派消灭中国共产党和红军的图谋彻底失败，宣告了中国共产党和红军肩负着民族希望胜利实现了北上抗日的战略转移，实现了中国共产党和中国革命事业从挫折走向胜利的伟大转折。`,
    xuexiUrl: 'https://www.xuexi.cn'
  },
  {
    title: '抗日战争的伟大胜利',
    coverImage: '',
    summary: '中国人民抗日战争，是近代以来中华民族反抗外敌入侵第一次取得完全胜利的民族解放战争。',
    content: `1937年7月7日，日本侵略者悍然发动全面侵华战争，给中国人民带来了前所未有的巨大灾难。在民族危亡的历史关头，中国共产党高举抗日民族统一战线的旗帜，坚决维护、巩固、发展统一战线，坚持独立自主、团结抗战，维护了团结抗战大局。

中国共产党人以自己的政治主张、坚定意志、模范行动，支撑起全民族救亡图存的希望，引领着夺取战争胜利的正确方向，成为夺取战争胜利的民族先锋。

经过14年艰苦卓绝的斗争，中国人民终于取得了抗日战争的伟大胜利，彻底粉碎了日本军国主义殖民奴役中国的图谋，重新确立了中国在世界上的大国地位，开辟了中华民族伟大复兴的光明前景。`,
    xuexiUrl: 'https://www.xuexi.cn'
  },
  {
    title: '新中国成立的历史意义',
    coverImage: '',
    summary: '1949年10月1日，中华人民共和国成立，中国人民从此站起来了，中华民族发展进步从此开启了新纪元。',
    content: `1949年10月1日下午3时，中华人民共和国开国大典在北京天安门广场隆重举行。毛泽东主席庄严宣告："中华人民共和国中央人民政府今天成立了！"

新中国的成立，彻底结束了旧中国半殖民地半封建社会的历史，彻底结束了旧中国一盘散沙的局面，彻底废除了列强强加给中国的不平等条约和帝国主义在中国的一切特权，实现了中国从几千年封建专制政治向人民民主的伟大飞跃。

中国人民从此站起来了，中华民族发展进步从此开启了新纪元，中国历史从此掀开了新篇章。`,
    xuexiUrl: 'https://www.xuexi.cn'
  },
  {
    title: '改革开放的伟大决策',
    coverImage: '',
    summary: '1978年，党的十一届三中全会作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策。',
    content: `1978年12月，党的十一届三中全会在北京召开。全会作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策，实现了新中国成立以来党的历史上具有深远意义的伟大转折。

改革开放是我们党的一次伟大觉醒，正是这个伟大觉醒孕育了我们党从理论到实践的伟大创造。改革开放是中国人民和中华民族发展史上一次伟大革命，正是这个伟大革命推动了中国特色社会主义事业的伟大飞跃。

40多年来，我们党团结带领人民进行改革开放新的伟大革命，破除阻碍国家和民族发展的一切思想和体制障碍，开辟了中国特色社会主义道路，使中国大踏步赶上时代。`,
    xuexiUrl: 'https://www.xuexi.cn'
  },
  {
    title: '脱贫攻坚的伟大成就',
    coverImage: '',
    summary: '经过全党全国各族人民共同努力，我国脱贫攻坚战取得了全面胜利，现行标准下9899万农村贫困人口全部脱贫。',
    content: `党的十八大以来，以习近平同志为核心的党中央把脱贫攻坚摆在治国理政突出位置，组织开展了声势浩大的脱贫攻坚人民战争。

经过8年持续奋斗，到2020年底，我国如期完成新时代脱贫攻坚目标任务，现行标准下9899万农村贫困人口全部脱贫，832个贫困县全部摘帽，12.8万个贫困村全部出列。

脱贫攻坚战的全面胜利，标志着我们党在团结带领人民创造美好生活、实现共同富裕的道路上迈出了坚实的一大步。这是中国人民的伟大光荣，是中国共产党的伟大光荣，是中华民族的伟大光荣！`,
    xuexiUrl: 'https://www.xuexi.cn'
  }
];

// 初始化数据
export const initializeData = async () => {
  try {
    console.log('开始初始化数据...');

    // 检查是否已有数据
    const existingQuestions = await Question.count();
    if (existingQuestions > 0) {
      console.log('题目数据已存在，跳过初始化');
    } else {
      // 插入题目
      for (const q of questions) {
        await Question.create({
          ...q,
          isActive: true
        });
      }
      console.log(`成功添加 ${questions.length} 道题目`);
    }

    // 检查卡组数据
    const existingCardSets = await CardSet.count();
    if (existingCardSets > 0) {
      console.log('卡组数据已存在，跳过初始化');
    } else {
      // 插入卡组和卡片
      for (const set of cardSets) {
        const cardSet = await CardSet.create({
          name: set.name,
          description: set.description,
          theme: set.theme,
          totalCards: set.cards.length,
          isActive: true
        });

        for (const card of set.cards) {
          await Card.create({
            setId: cardSet.id,
            name: card.name,
            description: card.description,
            imageUrl: card.imageUrl,
            rarity: card.rarity
          });
        }
      }
      console.log(`成功添加 ${cardSets.length} 个卡组`);
    }

    // 检查故事数据
    const existingStories = await Story.count();
    if (existingStories > 0) {
      console.log('故事数据已存在，跳过初始化');
    } else {
      // 插入故事
      for (const story of stories) {
        await Story.create({
          ...story,
          isActive: true
        });
      }
      console.log(`成功添加 ${stories.length} 个红色故事`);
    }

    console.log('数据初始化完成！');
  } catch (error) {
    console.error('数据初始化失败:', error);
    throw error;
  }
};
