# 部署指南

## 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 7.0
- 操作系统: Linux / macOS / Windows

## 快速开始

### 1. 安装依赖

#### 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装 Node.js 18 或更高版本。

#### 安装 MySQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**

下载并安装 [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

#### 安装 Redis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**

下载并安装 [Redis for Windows](https://github.com/microsoftarchive/redis/releases)

### 2. 配置数据库

登录 MySQL 并创建数据库：

```bash
mysql -u root -p
```

```sql
CREATE DATABASE patriotic_quiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON patriotic_quiz.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. 配置后端环境变量

进入后端目录并配置环境变量：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，修改以下配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=patriotic_quiz
DB_USER=quiz_user
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_random_secret_key_here
```

### 4. 使用启动脚本（推荐）

在项目根目录执行：

```bash
./start.sh
```

启动脚本会自动完成以下操作：
1. 检查环境依赖
2. 安装前后端依赖
3. 执行数据库迁移
4. 初始化示例数据（可选）
5. 启动后端和前端服务

### 5. 手动启动（可选）

如果不使用启动脚本，可以手动执行以下步骤：

#### 安装后端依赖

```bash
cd backend
npm install
```

#### 执行数据库迁移

```bash
npm run db:migrate
```

#### 初始化示例数据（可选）

```bash
npm run db:seed
```

这将创建：
- 管理员账号（用户名: admin, 密码: admin123）
- 5 道示例题目
- 2 个卡组（共 10 张卡片）
- 3 个红色故事

#### 启动后端服务

```bash
npm run dev
```

后端服务将在 http://localhost:3001 启动

#### 安装前端依赖

打开新终端，进入前端目录：

```bash
cd frontend
npm install
```

#### 启动前端服务

```bash
npm run dev
```

前端服务将在 http://localhost:5173 启动

## 访问系统

打开浏览器访问: http://localhost:5173

### 默认账号

**管理员账号:**
- 用户名: `admin`
- 密码: `admin123`

**测试用户:**

可以通过注册页面创建新用户

## 生产环境部署

### 1. 构建前端

```bash
cd frontend
npm run build
```

构建产物将生成在 `frontend/dist` 目录

### 2. 配置 Nginx

创建 Nginx 配置文件 `/etc/nginx/sites-available/patriotic-quiz`:

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

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/patriotic-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 使用 PM2 管理后端进程

安装 PM2：

```bash
npm install -g pm2
```

启动后端服务：

```bash
cd backend
pm2 start src/index.js --name patriotic-quiz-backend
pm2 save
pm2 startup
```

### 4. 配置 SSL（可选）

使用 Let's Encrypt 免费 SSL 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 常见问题

### 1. 数据库连接失败

检查 MySQL 服务是否运行：

```bash
sudo systemctl status mysql
```

检查数据库配置是否正确：

```bash
mysql -u quiz_user -p -h localhost patriotic_quiz
```

### 2. Redis 连接失败

检查 Redis 服务是否运行：

```bash
sudo systemctl status redis
```

测试 Redis 连接：

```bash
redis-cli ping
```

### 3. 端口被占用

修改后端端口（backend/.env）：

```env
PORT=3002
```

修改前端代理配置（frontend/vite.config.js）：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3002',
    changeOrigin: true
  }
}
```

### 4. 前端无法访问后端 API

检查后端服务是否正常运行：

```bash
curl http://localhost:3001/api/health
```

检查 CORS 配置是否正确

## 维护操作

### 备份数据库

```bash
mysqldump -u quiz_user -p patriotic_quiz > backup_$(date +%Y%m%d).sql
```

### 恢复数据库

```bash
mysql -u quiz_user -p patriotic_quiz < backup_20260209.sql
```

### 查看日志

**后端日志（PM2）:**

```bash
pm2 logs patriotic-quiz-backend
```

**Nginx 日志:**

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 技术支持

如遇到问题，请查看：
- [需求文档](.monkeycode/specs/patriotic-quiz-rewards/requirements.md)
- [技术设计文档](.monkeycode/specs/patriotic-quiz-rewards/design.md)
