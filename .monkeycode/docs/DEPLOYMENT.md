# 部署文档

## 部署概览

系统采用前后端分离架构，部署时需要提供后端 API 服务与前端静态资源。生产环境推荐使用 Nginx 托管前端构建产物，并通过反向代理将 `/api` 请求转发到后端服务。

## 环境要求

- Node.js 18 或更高版本
- MySQL 8 或更高版本
- Redis 7 可选
- Nginx 用于反向代理与静态资源服务

## 环境变量配置

后端通过 `backend/.env` 提供运行时配置。可先复制示例文件：

```bash
cd backend
cp .env.example .env
```

### 必需变量

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `DB_HOST` | 数据库地址 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_NAME` | 数据库名称 | `patriotic_quiz` |
| `DB_USER` | 数据库用户 | `quiz_user` |
| `DB_PASSWORD` | 数据库密码 | `your_password` |
| `JWT_SECRET` | JWT 密钥 | `your_jwt_secret_key` |

### 可选变量

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `PORT` | 后端服务端口 | `3001` |
| `NODE_ENV` | 运行环境 | `production` |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `BCRYPT_ROUNDS` | 密码哈希轮数 | `10` |
| `MAX_LOGIN_ATTEMPTS` | 最大登录失败次数 | `5` |
| `LOCK_TIME` | 登录锁定时间分钟 | `30` |
| `RATE_LIMIT_WINDOW` | 限流窗口毫秒 | `60000` |
| `RATE_LIMIT_MAX` | 限流次数上限 | `10` |

### MySQL 与 SQLite 切换

默认使用 MySQL。若需使用 SQLite，可配置以下变量：

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `DB_DIALECT` | 数据库类型 | `sqlite` |
| `DB_STORAGE` | SQLite 文件路径 | `./database.sqlite` |

### Redis 相关

`backend/.env.example` 中提供了 Redis 变量，但当前代码在 `backend/src/config/redis.js` 中将 Redis 固定为禁用模式。即使配置 Redis 变量，服务仍不会连接 Redis。若需要启用 Redis，需要调整该文件实现实际连接逻辑。

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `REDIS_HOST` | Redis 地址 | `localhost` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `REDIS_PASSWORD` | Redis 密码 | `` |

### Linux Do OAuth

若启用 Linux Do 登录，请配置以下变量：

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `LINUXDO_CLIENT_ID` | OAuth Client ID | `your_client_id` |
| `LINUXDO_CLIENT_SECRET` | OAuth Client Secret | `your_client_secret` |
| `LINUXDO_REDIRECT_URI` | 回调地址 | `https://your-domain.com/auth/linuxdo/callback` |
| `LINUXDO_AUTH_URL` | 授权地址 | `https://connect.linux.do/oauth2/authorize` |
| `LINUXDO_TOKEN_URL` | Token 地址 | `https://connect.linux.do/oauth2/token` |
| `LINUXDO_USER_INFO_URL` | 用户信息地址 | `https://connect.linux.do/api/user` |

## 数据库初始化

```bash
cd backend
npm run db:migrate
```

初始化示例数据：

```bash
cd backend
npm run db:seed
```

## 构建与部署前端

```bash
cd frontend
npm run build
```

构建产物输出在 `frontend/dist`，可由 Nginx 或任意静态资源服务器托管。

## 运行后端服务

```bash
cd backend
npm run start
```

## Nginx 反向代理示例

创建 Nginx 配置文件并加载：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 部署校验清单

- `backend/.env` 已填写并生效
- 数据库已迁移成功
- 后端服务能正常响应 `/api/health`
- 前端静态资源可以访问，并能通过 `/api` 访问后端
- Linux Do OAuth 回调地址与控制台配置一致
