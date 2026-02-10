# Docker 镜像上传方案总结

## 当前状态

✅ **已完成**:
- Docker 镜像已成功构建
- 镜像已导出为 tar 文件

❌ **网络限制**:
- 当前环境无法直接连接到 Docker Hub
- 尝试的镜像加速器无法用于推送操作
- 提供的代理是订阅链接，包含 Trojan/Hysteria2/SS 协议，Docker 无法直接使用

## 推荐方案：使用导出的镜像文件

### 已导出的文件

- `presenthelper-backend.tar` (77 MB)
- `presenthelper-frontend.tar` (26 MB)

### 上传步骤

在有网络连接的环境中执行：

```bash
# 1. 导入镜像
docker load -i presenthelper-backend.tar
docker load -i presenthelper-frontend.tar

# 2. 验证镜像
docker images | grep presenthelper

# 3. 登录 Docker Hub
echo "<your_docker_token>" | docker login -u technologystar --password-stdin

# 4. 推送镜像
docker push technologystar/presenthelper:backend-latest
docker push technologystar/presenthelper:frontend-latest

# 5. 登出
docker logout
```

## 替代方案

### 方案 A: 使用代理客户端

如果你有 Clash、V2Ray 等代理客户端：

1. 使用代理客户端导入你的订阅链接
2. 启动本地代理（通常是 http://127.0.0.1:7890）
3. 配置 Docker 使用代理：

```bash
# 创建 Docker 代理配置
mkdir -p /etc/systemd/system/docker.service.d
cat > /etc/systemd/system/docker.service.d/http-proxy.conf << EOF
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1"
EOF

# 重启 Docker
systemctl daemon-reload
systemctl restart docker

# 然后执行上传
./docker-build.sh <your_docker_token>
```

### 方案 B: 使用其他机器

1. 将 tar 文件传输到有网络的机器
2. 在该机器上导入并推送镜像

### 方案 C: 使用 GitHub Actions

创建 GitHub Actions 工作流自动构建和推送：

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: technologystar
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and push backend
        run: |
          cd backend
          docker build -t technologystar/presenthelper:backend-latest .
          docker push technologystar/presenthelper:backend-latest

      - name: Build and push frontend
        run: |
          cd frontend
          docker build -t technologystar/presenthelper:frontend-latest .
          docker push technologystar/presenthelper:frontend-latest
```

## 文件位置

镜像文件位于项目根目录：
- `/workspace/presenthelper-backend.tar`
- `/workspace/presenthelper-frontend.tar`

## 相关文档

- `DOCKER_EXPORT_GUIDE.md` - 镜像导出和上传详细说明
- `DOCKER_DEPLOYMENT.md` - 完整部署指南
- `DOCKER_QUICKSTART.md` - 快速参考
- `README_DOCKER.md` - 文件清单和技术说明

## 安全提示

⚠️ **重要**:
- 镜像文件已在 `.gitignore` 中排除，不会被提交
- 上传完成后删除本地 tar 文件
- 上传完成后更换 Docker Hub token
- 不要将 token 提交到 Git 仓库

## 验证上传

上传成功后，访问：
- https://hub.docker.com/r/technologystar/presenthelper/tags

任何人都可以拉取镜像：
```bash
docker pull technologystar/presenthelper:backend-latest
docker pull technologystar/presenthelper:frontend-latest
```
