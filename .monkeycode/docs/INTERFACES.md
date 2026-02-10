# 接口文档

## 基本信息

- **Base URL**: `/api`
- **认证方式**: `Authorization: Bearer <JWT>`
- **响应格式**: 所有接口返回统一结构

```json
{
  "success": true,
  "code": 0,
  "message": "Success",
  "data": {}
}
```

## 鉴权与限流

- 需要登录的接口使用 JWT 鉴权
- 管理端接口需要管理员角色
- 登录与 Linux Do 回调使用严格限流
- 答题提交、签到、阅读故事、兑换使用通用限流

## 健康检查

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/health` | 否 | 服务健康检查 |

## 认证与用户

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| POST | `/auth/register` | 否 | 用户注册 |
| POST | `/auth/login` | 否 | 用户登录 |
| GET | `/auth/profile` | 是 | 获取用户资料 |

## Linux Do OAuth

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/linuxdo/auth-url` | 否 | 获取授权链接 |
| POST | `/linuxdo/callback` | 否 | 处理授权回调 |

## 答题

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/quiz/daily` | 是 | 获取每日题目 |
| POST | `/quiz/submit` | 是 | 提交答题 |
| POST | `/quiz/complete` | 是 | 完成答题 |
| GET | `/quiz/history` | 是 | 答题历史 |

## 集卡与签到

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/card/my-cards` | 是 | 我的卡片 |
| GET | `/card/card-sets` | 是 | 卡组列表 |
| GET | `/card/checkin/status` | 是 | 签到状态 |
| POST | `/card/checkin` | 是 | 签到 |
| GET | `/card/checkin/history` | 是 | 签到历史 |

## 签到独立路由

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/checkin/status` | 是 | 签到状态 |
| POST | `/checkin` | 是 | 签到 |
| GET | `/checkin/history` | 是 | 签到历史 |

## 邀请

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/invite/my` | 是 | 邀请记录 |

## 红色故事

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/stories` | 是 | 故事列表 |
| GET | `/stories/:id` | 是 | 故事详情 |
| POST | `/stories/:id/read` | 是 | 标记阅读 |

## 排行榜

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/ranking/points` | 是 | 积分排行 |
| GET | `/ranking/quiz` | 是 | 答题排行 |

## 商城与兑换

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/shop/items` | 是 | 可兑换奖励 |
| POST | `/shop/redeem` | 是 | 兑换奖励 |
| GET | `/shop/my-redemptions` | 是 | 兑换记录 |

## 管理端

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| GET | `/admin/statistics` | 是 | 统计数据 |
| POST | `/admin/questions` | 是 | 创建题目 |
| PUT | `/admin/questions/:id` | 是 | 更新题目 |
| DELETE | `/admin/questions/:id` | 是 | 停用题目 |
| GET | `/admin/questions` | 是 | 题目列表 |
| POST | `/admin/cardsets` | 是 | 创建卡组 |
| GET | `/admin/cardsets` | 是 | 卡组列表 |
| PUT | `/admin/cards/:id` | 是 | 更新卡片 |
