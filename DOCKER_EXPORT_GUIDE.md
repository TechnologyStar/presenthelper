# Docker 镜像导出说明

## 镜像文件信息

已成功导出以下 Docker 镜像文件：

- **后端镜像**: `presenthelper-backend.tar` (77 MB)
- **前端镜像**: `presenthelper-frontend.tar` (26 MB)

## 使用方法

### 在有网络的环境中上传镜像

1. **下载镜像文件**

   将以下两个文件下载到本地：
   - `presenthelper-backend.tar`
   - `presenthelper-frontend.tar`

2. **在目标机器上导入镜像**

   ```bash
   # 导入后端镜像
   docker load -i presenthelper-backend.tar

   # 导入前端镜像
   docker load -i presenthelper-frontend.tar
   ```

3. **验证镜像已导入**

   ```bash
   docker images | grep presenthelper
   ```

   应该看到：
   ```
   technologystar/presenthelper   backend-latest   ...   335MB
   technologystar/presenthelper   frontend-latest  ...   94.7MB
   ```

4. **登录 Docker Hub**

   ```bash
   docker login -u technologystar
   # 输入密码: <your_docker_token>
   ```

   或使用命令行：
   ```bash
   echo "<your_docker_token>" | docker login -u technologystar --password-stdin
   ```

5. **推送镜像到 Docker Hub**

   ```bash
   # 推送后端镜像
   docker push technologystar/presenthelper:backend-latest

   # 推送前端镜像
   docker push technologystar/presenthelper:frontend-latest
   ```

6. **登出**

   ```bash
   docker logout
   ```

## 验证上传

访问 Docker Hub 查看镜像：
- https://hub.docker.com/r/technologystar/presenthelper/tags

## 使用已上传的镜像

上传成功后，任何人都可以拉取这些镜像：

```bash
# 拉取后端镜像
docker pull technologystar/presenthelper:backend-latest

# 拉取前端镜像
docker pull technologystar/presenthelper:frontend-latest
```

## 使用 Docker Compose 部署

```bash
# 1. 准备环境变量
cp .env.docker.example .env
# 编辑 .env 文件，修改密码和密钥

# 2. 启动所有服务
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

## 访问应用

- **前端**: http://localhost
- **后端 API**: http://localhost:3001
- **默认账号**: admin / admin123

## 注意事项

⚠️ **安全提示**:
- 镜像文件已导出，可以安全传输
- 上传完成后建议删除本地的 tar 文件
- 上传完成后记得执行 `docker logout`
- 建议定期更换 Docker Hub token

## 文件位置

镜像文件位于项目根目录：
- `/workspace/presenthelper-backend.tar`
- `/workspace/presenthelper-frontend.tar`

## 故障排查

### 问题 1: 导入镜像失败

```bash
# 检查文件完整性
ls -lh presenthelper-*.tar

# 重新导入
docker load -i presenthelper-backend.tar
```

### 问题 2: 推送超时

```bash
# 检查网络连接
ping registry-1.docker.io

# 尝试使用镜像加速器
# 配置 /etc/docker/daemon.json
```

### 问题 3: 权限不足

```bash
# 确保已登录
docker login -u technologystar

# 检查仓库权限
# 访问 https://hub.docker.com/repository/docker/technologystar/presenthelper/settings
```
