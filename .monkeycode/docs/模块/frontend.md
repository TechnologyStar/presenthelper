# 前端模块

## 模块职责

前端应用负责用户交互、页面路由、状态管理与 API 调用。所有 API 请求以 `/api` 为前缀，并通过 Vite 代理转发到后端服务。

## 入口与构建

- `frontend/src/main.js` 应用入口
- `frontend/vite.config.js` Vite 配置与代理

## 路由与页面

路由配置位于 `frontend/src/router`，页面组件位于 `frontend/src/views`，主要覆盖：

- 登录与注册
- 答题与历史
- 集卡与签到
- 红色故事阅读
- 积分排行与兑换
- 管理端页面

## 状态管理

Pinia store 位于 `frontend/src/stores`，主要负责：

- 用户登录状态
- Token 与用户信息缓存
- Linux Do OAuth 登录流程

## API 调用

统一请求封装位于 `frontend/src/utils/request.js`：

- `baseURL` 固定为 `/api`
- 自动附加 `Authorization: Bearer <JWT>`
- 统一响应错误处理

## 组件体系

通用组件位于 `frontend/src/components`，包含表单、卡片、列表与弹窗等 UI 复用组件。
