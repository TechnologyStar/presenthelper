# 后端模块

## 模块职责

后端服务负责认证、业务逻辑、数据持久化与管理端接口。所有 API 以 `/api` 为前缀，对外提供统一响应格式。

## 入口与启动

- `backend/src/index.js` 负责加载环境变量、连接数据库、挂载路由并启动服务
- 启动脚本位于 `backend/package.json` 中的 `dev` 和 `start`

## 路由层

路由集中在 `backend/src/routes`，通过 `backend/src/routes/index.js` 统一注册：

- `auth.js` 用户注册与登录
- `linuxdo.js` Linux Do OAuth 登录
- `quiz.js` 答题流程
- `card.js` 集卡与签到
- `checkin.js` 签到独立路由
- `invite.js` 邀请记录
- `story.js` 红色故事
- `ranking.js` 排行榜
- `shop.js` 奖励兑换
- `admin.js` 管理端接口

## 控制器层

控制器位于 `backend/src/controllers`，分别实现业务逻辑和数据库交互：

- `authController.js` 登录注册与资料
- `linuxdoController.js` OAuth 授权与回调
- `quizController.js` 答题获取、提交与历史
- `cardController.js` 集卡与签到逻辑
- `storyController.js` 故事阅读
- `shopController.js` 奖励兑换与记录
- `rankingController.js` 排行榜
- `adminController.js` 题库与卡组管理

## 数据模型

模型位于 `backend/src/models`，通过 `backend/src/models/index.js` 定义关联关系：

- 用户与答题、签到、卡片、邀请、故事阅读、兑换记录
- 卡组与卡片、用户卡片
- 奖励类型与兑换记录
- 活动与参与记录

## 中间件与工具

- `middlewares/auth.js` JWT 鉴权与管理员权限
- `middlewares/rateLimiter.js` 接口限流
- `middlewares/validator.js` 请求参数校验
- `utils/jwt.js` JWT 生成与校验
- `utils/response.js` 统一响应结构

## 脚本

- `scripts/migrate.js` 数据库迁移
- `scripts/seed.js` 初始化示例数据
