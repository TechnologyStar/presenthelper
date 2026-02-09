# Linux Do OAuth 登录配置指南

## 功能说明

系统已集成 Linux Do OAuth 2.0 登录功能，用户可以使用 Linux Do 账号快速登录，无需注册。

## 配置步骤

### 1. 申请 Linux Do OAuth 应用

1. 访问 [Linux Do Connect](https://connect.linux.do)
2. 点击「我的应用接入」-「申请新接入」
3. 填写应用信息：
   - **应用名称**: 爱国红色答题系统
   - **应用描述**: 爱国主义教育互动平台
   - **回调地址**: `http://localhost:5173/auth/linuxdo/callback`（开发环境）
   - 生产环境回调地址: `https://your-domain.com/auth/linuxdo/callback`

4. 提交申请后，获得 `Client ID` 和 `Client Secret`

### 2. 配置后端环境变量

编辑 `backend/.env` 文件，添加以下配置：

```env
# Linux Do OAuth 配置
LINUXDO_CLIENT_ID=你的_Client_ID
LINUXDO_CLIENT_SECRET=你的_Client_Secret
LINUXDO_REDIRECT_URI=http://localhost:5173/auth/linuxdo/callback
LINUXDO_AUTH_URL=https://connect.linux.do/oauth2/authorize
LINUXDO_TOKEN_URL=https://connect.linux.do/oauth2/token
LINUXDO_USER_INFO_URL=https://connect.linux.do/api/user
```

**注意**:
- 将 `你的_Client_ID` 和 `你的_Client_Secret` 替换为实际的值
- 生产环境需要修改 `LINUXDO_REDIRECT_URI` 为实际的域名

### 3. 更新数据库

由于添加了新的用户字段（Linux Do 相关信息），需要重新执行数据库迁移：

```bash
cd backend
npm run db:migrate
```

### 4. 重启服务

```bash
# 如果使用启动脚本
./start.sh

# 或者手动重启
cd backend
npm run dev

cd frontend
npm run dev
```

## 使用流程

### 用户登录流程

1. 用户访问登录页面
2. 点击「使用 Linux Do 登录」按钮
3. 跳转到 Linux Do 授权页面
4. 用户在 Linux Do 授权页面确认授权
5. 授权成功后自动跳转回系统
6. 系统自动完成登录并跳转到首页

### 首次登录

- 首次使用 Linux Do 登录时，系统会自动创建账号
- 用户名默认为 Linux Do 用户名
- 自动生成唯一邀请码
- 同步 Linux Do 头像和信任等级

### 后续登录

- 已有账号的用户直接登录
- 自动更新 Linux Do 用户信息（用户名、头像、信任等级）

## 获取的用户信息

系统从 Linux Do 获取以下用户信息：

| 字段 | 说明 | 用途 |
|------|------|------|
| id | 用户唯一标识 | 关联 Linux Do 账号 |
| username | 用户名 | 显示用户名 |
| avatar_template | 头像模板 | 显示用户头像 |
| trust_level | 信任等级 (0-4) | 可用于权限控制或奖励分配 |
| active | 账号活跃状态 | 账号状态检查 |

## 数据库字段

用户表新增字段：

```sql
linuxdo_id VARCHAR(50) UNIQUE -- Linux Do 用户唯一标识
linuxdo_username VARCHAR(100) -- Linux Do 用户名
linuxdo_avatar VARCHAR(500) -- Linux Do 用户头像
linuxdo_trust_level INT -- Linux Do 信任等级
```

## API 接口

### 获取授权链接

```
GET /api/linuxdo/auth-url
```

**响应示例:**
```json
{
  "success": true,
  "code": 0,
  "message": "Success",
  "data": {
    "authUrl": "https://connect.linux.do/oauth2/authorize?client_id=xxx&redirect_uri=xxx&response_type=code&scope=user"
  }
}
```

### 处理回调

```
POST /api/linuxdo/callback
```

**请求参数:**
```json
{
  "code": "授权码"
}
```

**响应示例:**
```json
{
  "success": true,
  "code": 0,
  "message": "Linux Do 登录成功",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "user_id",
      "username": "username",
      "inviteCode": "ABCD1234",
      "points": 0,
      "role": "user",
      "linuxdoUsername": "linuxdo_username",
      "linuxdoAvatar": "https://connect.linux.do/user_avatar/...",
      "linuxdoTrustLevel": 2
    }
  }
}
```

## 安全说明

1. **Client Secret 保护**
   - Client Secret 仅存储在后端环境变量中
   - 前端代码中不包含任何敏感信息
   - 不要将 `.env` 文件提交到版本控制系统

2. **回调地址验证**
   - Linux Do 会验证回调地址是否与申请时填写的一致
   - 确保回调地址配置正确

3. **Token 安全**
   - 访问令牌仅在后端使用
   - 前端只接收 JWT Token

## 常见问题

### 1. 授权失败

**问题**: 点击登录按钮后无法跳转或提示错误

**解决方案**:
- 检查 `LINUXDO_CLIENT_ID` 是否配置正确
- 检查网络连接是否正常
- 查看浏览器控制台错误信息

### 2. 回调失败

**问题**: 授权后跳转回系统但登录失败

**解决方案**:
- 检查 `LINUXDO_CLIENT_SECRET` 是否配置正确
- 检查 `LINUXDO_REDIRECT_URI` 是否与 Linux Do 后台配置一致
- 查看后端日志错误信息

### 3. 用户信息获取失败

**问题**: 登录成功但用户信息不完整

**解决方案**:
- 检查 `LINUXDO_USER_INFO_URL` 是否正确
- 检查网络连接
- 查看后端日志

## 生产环境配置

### 1. 更新回调地址

在 Linux Do Connect 后台更新回调地址为生产环境域名：

```
https://your-domain.com/auth/linuxdo/callback
```

### 2. 更新环境变量

```env
LINUXDO_REDIRECT_URI=https://your-domain.com/auth/linuxdo/callback
```

### 3. 配置 HTTPS

确保生产环境使用 HTTPS 协议，保证数据传输安全。

## 参考资料

- [Linux Do Connect 官方文档](https://wiki.linux.do/connect)
- [OAuth 2.0 规范](https://oauth.net/2/)
