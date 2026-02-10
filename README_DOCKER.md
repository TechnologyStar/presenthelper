# Docker 部署文件清单

## 已创建的文件

### 1. Dockerfile 文件

#### 后端 Dockerfile
- **位置**: `backend/Dockerfile`
- **基础镜像**: node:18-alpine
- **暴露端口**: 3001
- **说明**: 使用 Node.js 18 Alpine 版本，体积小巧，适合生产环境

#### 前端 Dockerfile
- **位置**: `frontend/Dockerfile`
- **构建方式**: 多阶段构建
  - 第一阶段: 使用 node:18-alpine 构建前端资源
  - 第二阶段: 使用 nginx:alpine 提供静态文件服务
- **暴露端口**: 80
- **说明**: 多阶段构建可以大幅减小最终镜像体积

### 2. Docker Compose 配置

- **位置**: `docker-compose.yml`
- **包含服务**:
  - MySQL 8.0 数据库
  - Redis 7 缓存
  - 后端服务 (Node.js)
  - 前端服务 (Nginx)
- **数据持久化**:
  - mysql_data: MySQL 数据
  - redis_data: Redis 数据
  - backend/uploads: 上传文件

### 3. Nginx 配置

- **位置**: `frontend/nginx.conf`
- **功能**:
  - 支持 Vue Router 的 history 模式
  - API 请求代理到后端服务
  - 静态资源缓存优化
  - Gzip 压缩

### 4. .dockerignore 文件

- **位置**:
  - `backend/.dockerignore`
  - `frontend/.dockerignore`
  - `.dockerignore` (根目录)
- **作用**: 排除不必要的文件，减小构建上下文

### 5. 环境变量模板

- **位置**: `.env.docker.example`
- **包含配置**:
  - MySQL 数据库配置
  - JWT 密钥
  - Node.js 环境变量

### 6. 自动化脚本

- **位置**: `docker-build.sh`
- **功能**: 一键构建和上传 Docker 镜像
- **使用方法**: `./docker-build.sh <docker_token>`

### 7. 文档

- **DOCKER_DEPLOYMENT.md**: Docker 部署完整指南
- **DOCKER_UPLOAD_GUIDE.md**: 镜像上传详细说明
- **README_DOCKER.md**: 本文件

## 镜像构建状态

✅ **后端镜像**: `technologystar/presenthelper:backend-latest`
- 大小: 335MB
- 状态: 已构建完成

✅ **前端镜像**: `technologystar/presenthelper:frontend-latest`
- 大小: 94.7MB
- 状态: 已构建完成

## 代码修复

在构建过程中发现并修复了以下问题:

### 前端代码问题
- **文件**: `frontend/src/views/AdminDashboard.vue`
- **问题**: `getStatistics` 函数重复声明
- **修复**: 删除了重复的函数定义，保留从 API 模块导入的版本

## 下一步操作

### 在有网络的环境中上传镜像

1. **使用自动化脚本（推荐）**:
   ```bash
   ./docker-build.sh <your_docker_token>
   ```

2. **手动上传**:
   ```bash
   # 登录
   echo "<your_docker_token>" | docker login -u technologystar --password-stdin

   # 推送镜像
   docker push technologystar/presenthelper:backend-latest
   docker push technologystar/presenthelper:frontend-latest

   # 登出
   docker logout
   ```

### 部署应用

1. **准备环境变量**:
   ```bash
   cp .env.docker.example .env
   # 编辑 .env 文件，修改密码和密钥
   ```

2. **启动服务**:
   ```bash
   docker-compose up -d
   ```

3. **访问应用**:
   - 前端: http://localhost
   - 后端 API: http://localhost:3001

## 安全注意事项

⚠️ **重要提醒**:

1. **Docker Hub Token**:
   - Token 已在脚本中使用，但不会保存到文件
   - 请勿将 token 提交到 Git 仓库
   - 建议上传完成后更换 token

2. **环境变量**:
   - `.env` 文件已在 .gitignore 中
   - 生产环境请修改所有默认密码
   - JWT_SECRET 请使用强随机字符串

3. **Git 提交**:
   - 确保不提交包含敏感信息的文件
   - 检查 .gitignore 规则是否生效

## 文件结构

```
.
├── backend/
│   ├── Dockerfile              # 后端 Docker 镜像定义
│   ├── .dockerignore          # 后端构建忽略文件
│   └── ...
├── frontend/
│   ├── Dockerfile              # 前端 Docker 镜像定义
│   ├── .dockerignore          # 前端构建忽略文件
│   ├── nginx.conf             # Nginx 配置
│   └── ...
├── docker-compose.yml          # Docker Compose 配置
├── .dockerignore              # 根目录构建忽略文件
├── .env.docker.example        # 环境变量模板
├── docker-build.sh            # 自动化构建上传脚本
├── DOCKER_DEPLOYMENT.md       # 部署指南
├── DOCKER_UPLOAD_GUIDE.md     # 上传指南
└── README_DOCKER.md           # 本文件
```

## 常见问题

### Q: 如何更新镜像？

A: 修改代码后重新构建并推送:
```bash
docker build -t technologystar/presenthelper:backend-latest ./backend
docker push technologystar/presenthelper:backend-latest
```

### Q: 如何查看容器日志？

A: 使用 docker-compose:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Q: 如何重启服务？

A:
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Q: 如何完全清理并重新部署？

A:
```bash
docker-compose down -v
docker-compose up -d
```

## 技术栈

- **后端**: Node.js 18 + Express + Sequelize + MySQL + Redis
- **前端**: Vue 3 + Vite + Element Plus
- **容器**: Docker + Docker Compose
- **Web 服务器**: Nginx (前端)

## 联系方式

如有问题，请查看:
- DOCKER_DEPLOYMENT.md - 完整部署指南
- DOCKER_UPLOAD_GUIDE.md - 镜像上传说明
