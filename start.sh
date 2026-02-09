#!/bin/bash

echo "======================================"
echo "爱国红色答题系统 - 启动脚本"
echo "======================================"

echo ""
echo "检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "错误: 未安装 Node.js，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "错误: Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "Node.js 版本: $(node -v) ✓"

echo ""
echo "检查 MySQL 连接..."
if ! command -v mysql &> /dev/null; then
    echo "警告: 未找到 mysql 命令，请确保 MySQL 已安装并运行"
fi

echo ""
echo "检查 Redis 连接..."
if ! command -v redis-cli &> /dev/null; then
    echo "警告: 未找到 redis-cli 命令，请确保 Redis 已安装并运行"
fi

echo ""
echo "======================================"
echo "步骤 1: 安装后端依赖"
echo "======================================"
cd backend
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
else
    echo "后端依赖已安装 ✓"
fi

echo ""
echo "======================================"
echo "步骤 2: 配置后端环境变量"
echo "======================================"
if [ ! -f ".env" ]; then
    echo "错误: 未找到 .env 文件"
    echo "请复制 .env.example 为 .env 并配置数据库信息"
    exit 1
fi
echo "环境变量配置文件存在 ✓"

echo ""
echo "======================================"
echo "步骤 3: 数据库迁移"
echo "======================================"
echo "执行数据库迁移..."
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "错误: 数据库迁移失败"
    exit 1
fi
echo "数据库迁移完成 ✓"

echo ""
echo "======================================"
echo "步骤 4: 数据库初始化（可选）"
echo "======================================"
read -p "是否需要初始化示例数据？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo "示例数据初始化完成 ✓"
fi

echo ""
echo "======================================"
echo "步骤 5: 启动后端服务"
echo "======================================"
echo "后端服务启动中..."
npm run dev &
BACKEND_PID=$!
echo "后端服务 PID: $BACKEND_PID"

sleep 3

cd ..

echo ""
echo "======================================"
echo "步骤 6: 安装前端依赖"
echo "======================================"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
else
    echo "前端依赖已安装 ✓"
fi

echo ""
echo "======================================"
echo "步骤 7: 启动前端服务"
echo "======================================"
echo "前端服务启动中..."
npm run dev &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

cd ..

echo ""
echo "======================================"
echo "启动完成！"
echo "======================================"
echo ""
echo "后端服务: http://localhost:3001"
echo "前端服务: http://localhost:5173"
echo ""
echo "默认管理员账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

trap "echo ''; echo '停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
