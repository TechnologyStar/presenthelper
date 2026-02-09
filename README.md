# 爱国红色答题与集卡奖励系统

一个基于 Web 的爱国主义教育互动平台，通过答题、签到、分享、阅读红色故事等多种方式激励用户学习红色文化知识，并提供第三方兑换码作为福利奖励。

## 项目特性

- **多样化答题系统**: 每日答题任务，涵盖爱国红色主题知识
- **集卡玩法**: 通过多种方式收集卡片，集齐卡组兑换奖励
- **每日签到**: 连续签到获得额外奖励
- **分享邀请**: 邀请好友注册获得卡片奖励
- **红色故事学习**: 阅读红色故事并跳转学习强国深度学习
- **福利兑换**: 支持第三方兑换码（京东卡、话费充值码等）
- **特殊活动**: 节假日限时活动提升用户参与度
- **管理后台**: 题库管理、福利码导入、数据统计等
- **Linux Do OAuth 登录**: 支持使用 Linux Do 账号快速登录

## 技术栈

### 前端
- Vue.js 3.x
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios

### 后端
- Node.js 18+
- Express.js
- Sequelize ORM
- MySQL 8.0
- Redis 7.0
- JWT 认证

## 项目结构

```
.
├── backend/          # 后端服务
│   ├── src/
│   │   ├── config/   # 配置文件
│   │   ├── models/   # 数据模型
│   │   ├── routes/   # 路由
│   │   ├── controllers/ # 控制器
│   │   ├── middlewares/ # 中间件
│   │   └── utils/    # 工具函数
│   └── package.json
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── views/    # 页面组件
│   │   ├── components/ # 通用组件
│   │   ├── router/   # 路由配置
│   │   ├── stores/   # 状态管理
│   │   └── api/      # API 接口
│   └── package.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 7.0

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 配置数据库

1. 创建 MySQL 数据库：

```sql
CREATE DATABASE patriotic_quiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置后端环境变量（复制 `.env.example` 为 `.env` 并修改）：

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=patriotic_quiz
DB_USER=root
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_jwt_secret

# Linux Do OAuth 配置（可选）
LINUXDO_CLIENT_ID=your_client_id
LINUXDO_CLIENT_SECRET=your_client_secret
LINUXDO_REDIRECT_URI=http://localhost:5173/auth/linuxdo/callback
```

**配置 Linux Do 登录（可选）:**

如需启用 Linux Do OAuth 登录功能，请参考 [Linux Do OAuth 配置指南](LINUXDO_OAUTH.md)。

### 启动服务

```bash
# 启动后端服务（开发模式）
cd backend
npm run dev

# 启动前端服务（开发模式）
cd frontend
npm run dev
```

访问 http://localhost:5173 查看前端应用。

## 功能模块

### 用户端功能

1. **用户认证**
   - 注册/登录
   - Linux Do OAuth 登录
   - 个人信息管理
   - 邀请码生成

2. **答题系统**
   - 每日答题任务（10 题）
   - 实时答题反馈
   - 答题历史记录

3. **集卡系统**
   - 卡册查看
   - 卡组收集进度
   - 卡片获取记录

4. **每日签到**
   - 签到打卡
   - 连续签到奖励
   - 签到历史

5. **分享邀请**
   - 生成邀请链接
   - 邀请统计
   - 邀请奖励

6. **红色故事**
   - 故事列表浏览
   - 故事详情阅读
   - 跳转学习强国

7. **奖励兑换**
   - 查看可兑换奖励
   - 积分/卡组兑换
   - 兑换历史

### 管理端功能

1. **题库管理**
   - 题目增删改查
   - 题目分类标签
   - 难度等级设置

2. **卡片管理**
   - 卡组创建
   - 卡片设计
   - 稀有度配置

3. **福利码管理**
   - 兑换码类型管理
   - 批量导入换取码
   - 库存查询统计

4. **活动管理**
   - 创建特殊活动
   - 活动规则配置
   - 活动数据统计

5. **数据统计**
   - 用户活跃度
   - 答题数据分析
   - 卡片发放统计
   - 奖励兑换统计

## 安全机制

- 密码 bcrypt 加密存储
- JWT Token 认证
- OAuth 2.0 第三方登录（Linux Do）
- 每日答题次数限制
- IP 地址监控
- 答题时间限制（防机器人）
- 接口频率限制

## 文档

详细的需求文档和技术设计文档请查看：

- [需求文档](.monkeycode/specs/patriotic-quiz-rewards/requirements.md)
- [技术设计文档](.monkeycode/specs/patriotic-quiz-rewards/design.md)
- [Linux Do OAuth 配置指南](LINUXDO_OAUTH.md)

## 许可证

MIT License
