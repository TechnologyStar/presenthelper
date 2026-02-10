# Docker 镜像上传指南

## 镜像构建状态

✅ 后端镜像已构建: `technologystar/presenthelper:backend-latest` (335MB)
✅ 前端镜像已构建: `technologystar/presenthelper:frontend-latest` (94.7MB)

## 方式一: 使用自动化脚本上传（推荐）

在有网络连接的环境中，使用提供的脚本一键上传:

```bash
# 执行上传脚本（token 作为参数传入）
./docker-build.sh <your_docker_token>
```

脚本会自动完成:
1. 登录 Docker Hub
2. 构建后端镜像
3. 构建前端镜像
4. 推送后端镜像
5. 推送前端镜像
6. 自动登出

## 方式二: 手动上传

### 步骤 1: 登录 Docker Hub

```bash
# 使用用户名登录
docker login -u technologystar

# 在密码提示处输入你的 token
# <your_docker_token>
```

或者使用命令行直接登录（token 不会保存到历史记录）:

```bash
echo "<your_docker_token>" | docker login -u technologystar --password-stdin
```

### 步骤 2: 构建镜像（如果还没构建）

```bash
# 构建后端镜像
cd backend
docker build -t technologystar/presenthelper:backend-latest .

# 构建前端镜像
cd ../frontend
docker build -t technologystar/presenthelper:frontend-latest .
```

### 步骤 3: 推送镜像到 Docker Hub

```bash
# 推送后端镜像
docker push technologystar/presenthelper:backend-latest

# 推送前端镜像
docker push technologystar/presenthelper:frontend-latest
```

### 步骤 4: 验证上传

访问 Docker Hub 查看镜像:
- https://hub.docker.com/r/technologystar/presenthelper/tags

### 步骤 5: 登出

```bash
docker logout
```

## 方式三: 导出镜像文件后上传

如果需要在不同机器之间传输镜像:

### 在当前机器导出镜像

```bash
# 导出后端镜像
docker save technologystar/presenthelper:backend-latest -o presenthelper-backend.tar

# 导出前端镜像
docker save technologystar/presenthelper:frontend-latest -o presenthelper-frontend.tar
```

### 在目标机器导入并上传

```bash
# 导入镜像
docker load -i presenthelper-backend.tar
docker load -i presenthelper-frontend.tar

# 登录 Docker Hub
echo "<your_docker_token>" | docker login -u technologystar --password-stdin

# 推送镜像
docker push technologystar/presenthelper:backend-latest
docker push technologystar/presenthelper:frontend-latest

# 登出
docker logout
```

## 使用已上传的镜像

上传成功后，任何人都可以拉取这些镜像:

```bash
# 拉取后端镜像
docker pull technologystar/presenthelper:backend-latest

# 拉取前端镜像
docker pull technologystar/presenthelper:frontend-latest
```

## 使用 Docker Compose 部署

```bash
# 确保 docker-compose.yml 文件存在
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 安全提示

⚠️ **重要**:
- Docker Hub 访问令牌 (token) 是敏感信息，请勿提交到 Git 仓库
- 建议使用环境变量或密钥管理工具存储 token
- 定期更换 token 以提高安全性
- 上传完成后立即执行 `docker logout`

## 故障排查

### 问题 1: 登录失败

```bash
# 检查 token 是否正确
# 确保 token 没有多余的空格或换行符
# 尝试重新生成 token
```

### 问题 2: 推送超时

```bash
# 检查网络连接
# 尝试使用镜像加速器
# 分段推送（先推送一个镜像，成功后再推送另一个）
```

### 问题 3: 权限不足

```bash
# 确保你有权限推送到 technologystar/presenthelper 仓库
# 检查 Docker Hub 仓库设置
```

## 镜像版本管理

建议使用语义化版本标签:

```bash
# 构建并标记特定版本
docker build -t technologystar/presenthelper:backend-v1.0.0 ./backend
docker build -t technologystar/presenthelper:backend-latest ./backend

# 推送多个标签
docker push technologystar/presenthelper:backend-v1.0.0
docker push technologystar/presenthelper:backend-latest
```

## 下一步

1. ✅ 镜像已构建完成
2. ⏳ 在有网络的环境中执行上传
3. ⏳ 验证镜像可以正常拉取
4. ⏳ 使用 docker-compose 测试部署
