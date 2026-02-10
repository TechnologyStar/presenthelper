#!/bin/bash

# Docker 镜像构建和上传脚本
# 使用方法: ./docker-build.sh <docker_token>

set -e

DOCKER_USERNAME="technologystar"
DOCKER_REPO="presenthelper"
VERSION="latest"

# 检查是否提供了 token
if [ -z "$1" ]; then
    echo "错误: 请提供 Docker Hub 访问令牌"
    echo "使用方法: ./docker-build.sh <docker_token>"
    exit 1
fi

DOCKER_TOKEN="$1"

echo "======================================"
echo "Docker 镜像构建和上传"
echo "======================================"
echo ""

# 登录 Docker Hub
echo "步骤 1: 登录 Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ $? -ne 0 ]; then
    echo "错误: Docker Hub 登录失败"
    exit 1
fi
echo "登录成功 ✓"
echo ""

# 构建后端镜像
echo "步骤 2: 构建后端镜像..."
docker build -t ${DOCKER_USERNAME}/${DOCKER_REPO}:backend-${VERSION} ./backend
echo "后端镜像构建完成 ✓"
echo ""

# 构建前端镜像
echo "步骤 3: 构建前端镜像..."
docker build -t ${DOCKER_USERNAME}/${DOCKER_REPO}:frontend-${VERSION} ./frontend
echo "前端镜像构建完成 ✓"
echo ""

# 推送后端镜像
echo "步骤 4: 推送后端镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/${DOCKER_REPO}:backend-${VERSION}
echo "后端镜像推送完成 ✓"
echo ""

# 推送前端镜像
echo "步骤 5: 推送前端镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/${DOCKER_REPO}:frontend-${VERSION}
echo "前端镜像推送完成 ✓"
echo ""

echo "======================================"
echo "所有镜像已成功上传！"
echo "======================================"
echo ""
echo "后端镜像: ${DOCKER_USERNAME}/${DOCKER_REPO}:backend-${VERSION}"
echo "前端镜像: ${DOCKER_USERNAME}/${DOCKER_REPO}:frontend-${VERSION}"
echo ""
echo "使用以下命令拉取镜像:"
echo "  docker pull ${DOCKER_USERNAME}/${DOCKER_REPO}:backend-${VERSION}"
echo "  docker pull ${DOCKER_USERNAME}/${DOCKER_REPO}:frontend-${VERSION}"
echo ""

# 登出
docker logout
