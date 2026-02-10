# 开发指南

## 项目目的

爱国红色答题与集卡奖励系统是一个教育互动平台，提供答题、签到、集卡、阅读红色故事与奖励兑换功能，并通过管理端支持题库和奖励运营。

**核心职责**:
- 面向用户的学习互动与奖励闭环
- 面向运营的题库与奖励管理
- Linux Do OAuth 登录集成

**相关系统**:
- Linux Do OAuth - 提供第三方登录能力

## 环境搭建

### 前置条件

- Node.js 18 或更高版本
- MySQL 8 或更高版本
- Redis 7 可选

### 初始化步骤

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 配置环境变量

```bash
cd backend
cp .env.example .env
```

根据 `backend/.env.example` 完成数据库、JWT 与 Linux Do OAuth 配置。

### 数据库迁移

```bash
cd backend
npm run db:migrate
```

### 初始化示例数据

```bash
cd backend
npm run db:seed
```

## 本地运行

### 启动后端

```bash
cd backend
npm run dev
```

### 启动前端

```bash
cd frontend
npm run dev
```

### 一键启动

```bash
./start.sh
```

## 项目结构说明

- `backend/src/index.js` 负责服务启动与路由挂载
- `backend/src/routes` 定义 API 路由
- `backend/src/controllers` 实现业务逻辑
- `backend/src/models` 定义数据模型与关联
- `backend/src/scripts` 提供迁移与初始化脚本
- `frontend/src/router` 定义页面路由
- `frontend/src/stores` 管理全局状态
- `frontend/src/utils/request.js` 统一封装 API 请求

## 常见任务

### 数据库迁移

```bash
cd backend
npm run db:migrate
```

### 重新初始化数据

```bash
cd backend
npm run db:seed
```

### 前端构建

```bash
cd frontend
npm run build
```

### 后端生产启动

```bash
cd backend
npm run start
```

## 构建与发布

- 前端使用 `npm run build` 生成 `frontend/dist`
- 生产环境通过 Nginx 反向代理 `/api` 到后端端口
- 后端通过 `npm run start` 或进程管理工具运行
