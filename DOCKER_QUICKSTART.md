# Docker 快速参考

## 一键上传镜像

```bash
./docker-build.sh <your_docker_token>
```

## 快速部署

```bash
# 1. 准备环境变量
cp .env.docker.example .env

# 2. 启动所有服务
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

## 访问地址

- 前端: http://localhost
- 后端: http://localhost:3001
- 默认账号: admin / admin123

## 常用命令

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 进入容器
docker-compose exec backend sh
docker-compose exec frontend sh

# 完全清理
docker-compose down -v
```

## 镜像信息

- 后端: `technologystar/presenthelper:backend-latest` (335MB)
- 前端: `technologystar/presenthelper:frontend-latest` (94.7MB)

## 详细文档

- 📖 [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - 完整部署指南
- 📤 [DOCKER_UPLOAD_GUIDE.md](./DOCKER_UPLOAD_GUIDE.md) - 镜像上传说明
- 📋 [README_DOCKER.md](./README_DOCKER.md) - 文件清单和说明
