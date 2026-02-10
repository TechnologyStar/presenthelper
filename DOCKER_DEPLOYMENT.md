# Docker 部署指南

## 快速开始

### 方式一：使用 Docker Compose（推荐）

1. **准备环境变量**
   ```bash
   cp .env.docker.example .env
   # 编辑 .env 文件，修改数据库密码和 JWT 密钥
   ```

2. **启动所有服务**
   ```bash
   docker-compose up -d
   ```

3. **查看服务状态**
   ```bash
   docker-compose ps
   ```

4. **查看日志**
   ```bash
   # 查看所有服务日志
   docker-compose logs -f

   # 查看特定服务日志
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

5. **停止服务**
   ```bash
   docker-compose down
   ```

6. **完全清理（包括数据卷）**
   ```bash
   docker-compose down -v
   ```

### 方式二：使用预构建镜像

1. **拉取镜像**
   ```bash
   docker pull technologystar/presenthelper:backend-latest
   docker pull technologystar/presenthelper:frontend-latest
   ```

2. **启动 MySQL**
   ```bash
   docker run -d \
     --name patriotic-quiz-mysql \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=patriotic_quiz \
     -e MYSQL_USER=quiz_user \
     -e MYSQL_PASSWORD=quiz_password \
     -p 3306:3306 \
     mysql:8.0
   ```

3. **启动 Redis**
   ```bash
   docker run -d \
     --name patriotic-quiz-redis \
     -p 6379:6379 \
     redis:7-alpine
   ```

4. **启动后端**
   ```bash
   docker run -d \
     --name patriotic-quiz-backend \
     --link patriotic-quiz-mysql:mysql \
     --link patriotic-quiz-redis:redis \
     -e DB_HOST=mysql \
     -e DB_PORT=3306 \
     -e DB_NAME=patriotic_quiz \
     -e DB_USER=quiz_user \
     -e DB_PASSWORD=quiz_password \
     -e REDIS_HOST=redis \
     -e REDIS_PORT=6379 \
     -e JWT_SECRET=your-secret-key \
     -p 3001:3001 \
     technologystar/presenthelper:backend-latest
   ```

5. **启动前端**
   ```bash
   docker run -d \
     --name patriotic-quiz-frontend \
     --link patriotic-quiz-backend:backend \
     -p 80:80 \
     technologystar/presenthelper:frontend-latest
   ```

## 构建和上传镜像

### 构建镜像

```bash
# 构建后端镜像
docker build -t technologystar/presenthelper:backend-latest ./backend

# 构建前端镜像
docker build -t technologystar/presenthelper:frontend-latest ./frontend
```

### 上传镜像到 Docker Hub

**使用自动化脚本（推荐）：**

```bash
# 使用脚本上传（token 作为参数传入，不会保存）
./docker-build.sh <your_docker_token>
```

**手动上传：**

```bash
# 登录 Docker Hub
docker login -u technologystar

# 推送镜像
docker push technologystar/presenthelper:backend-latest
docker push technologystar/presenthelper:frontend-latest
```

## 访问应用

- **前端应用**: http://localhost
- **后端 API**: http://localhost:3001
- **API 文档**: http://localhost:3001/api/health

## 默认账号

- **用户名**: admin
- **密码**: admin123

## 数据持久化

Docker Compose 配置了以下数据卷：

- `mysql_data`: MySQL 数据库数据
- `redis_data`: Redis 缓存数据
- `./backend/uploads`: 后端上传文件

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| MYSQL_ROOT_PASSWORD | MySQL root 密码 | rootpassword |
| MYSQL_DATABASE | 数据库名称 | patriotic_quiz |
| MYSQL_USER | 数据库用户名 | quiz_user |
| MYSQL_PASSWORD | 数据库密码 | quiz_password |
| JWT_SECRET | JWT 加密密钥 | your-secret-key-change-in-production |
| NODE_ENV | Node.js 环境 | production |

## 故障排查

### 后端无法连接数据库

```bash
# 检查 MySQL 是否启动
docker-compose ps mysql

# 查看 MySQL 日志
docker-compose logs mysql

# 进入 MySQL 容器检查
docker-compose exec mysql mysql -u quiz_user -p
```

### 前端无法访问后端 API

```bash
# 检查后端是否启动
docker-compose ps backend

# 查看后端日志
docker-compose logs backend

# 测试后端健康检查
curl http://localhost:3001/api/health
```

### 重新初始化数据库

```bash
# 停止服务并删除数据卷
docker-compose down -v

# 重新启动
docker-compose up -d

# 进入后端容器执行迁移
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

## 生产环境建议

1. **修改默认密码**: 在 `.env` 文件中修改所有默认密码
2. **使用强 JWT 密钥**: 生成随机的 JWT_SECRET
3. **配置 HTTPS**: 使用 Nginx 或 Traefik 作为反向代理
4. **定期备份**: 备份 MySQL 数据卷
5. **监控日志**: 配置日志收集和监控系统
6. **资源限制**: 在 docker-compose.yml 中添加资源限制

## 更新镜像

```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d
```
