# API 服务层使用指南

## 概述

该项目已完成用户认证和管理的API集成。所有API请求都通过 `api` 对象发送到后端服务器 `http://localhost:8080`。

## 文件说明

### http.ts
- **功能**：HTTP客户端配置和拦截器
- **特性**：
  - 自动添加认证Token到请求头
  - 统一的响应格式处理
  - 自动登出处理（401错误时）
  - 支持多种HTTP方法（GET, POST, PUT, DELETE, PATCH）
  - 支持文件上传和下载

### userService.ts
- **功能**：用户相关的API调用
- **导出的方法**：
  - `register(data)` - 用户注册
  - `login(data)` - 用户登录
  - `getCurrentUser()` - 获取当前用户信息
  - `updateUser(data)` - 修改用户信息
  - `getUserList(page, size)` - 获取用户列表

## API 列表

### 1. 用户注册
```typescript
// 请求
const response = await register({
  username: "用户名",
  email: "邮箱@example.com",
  password: "密码"
});

// 返回数据
{
  id: 123,
  username: "用户名",
  email: "邮箱@example.com",
  avatarUrl: null
}
```

### 2. 用户登录
```typescript
// 请求
const response = await login({
  account: "用户名或邮箱",
  password: "密码"
});

// 返回数据
{
  token: "JWT_TOKEN_STRING",
  user: {
    id: 123,
    username: "用户名",
    email: "邮箱@example.com",
    avatarUrl: "https://..."
  }
}
```

### 3. 获取当前用户信息
```typescript
// 需要登录状态
const response = await getCurrentUser();

// 返回数据
{
  id: 123,
  username: "用户名",
  email: "邮箱@example.com",
  avatarUrl: "https://..."
}
```

### 4. 修改用户信息
```typescript
// 需要登录状态
const response = await updateUser({
  username: "新用户名",      // 可选
  avatarUrl: "新头像URL"     // 可选
});

// 返回更新后的用户信息
```

### 5. 获取用户列表
```typescript
// 需要登录状态和权限
const response = await getUserList(1, 20);  // 第1页，每页20条

// 返回数据
{
  list: [
    { id: 1, username: "user1", email: "user1@example.com", avatarUrl: null },
    { id: 2, username: "user2", email: "user2@example.com", avatarUrl: null }
  ],
  total: 100,
  page: 1,
  size: 20
}
```

## 在组件中使用

### 登录示例（LoginPage.tsx）
```typescript
import { login } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';

const handleLogin = async () => {
  try {
    const response = await login({
      account: formData.username,
      password: formData.password
    });
    
    if (response) {
      const { token, user } = response;
      setAuth(token, user);  // 保存到Zustand store
      navigate('/');         // 跳转到首页
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### 注册示例（Register.tsx）
```typescript
import { register } from '@/services/userService';

const handleRegister = async () => {
  try {
    const response = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    if (response) {
      alert('注册成功，请登录');
      navigate('/login');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

## 认证状态管理

### useAuthStore 的方法

```typescript
import { useAuthStore } from '@/store/useAuthStore';

// 获取当前认证状态
const { token, user, setAuth, logout } = useAuthStore();

// 登录
setAuth(token, user);

// 登出
logout();
```

### 使用Hook检查登录状态

```typescript
import { useIsLogin, useAuthUser } from '@/store/useAuthStore';

// 方式1：检查是否登录
const isLogin = useIsLogin();

// 方式2：获取用户信息和登录状态
const { isLogin, user } = useAuthUser();
```

## 错误处理

所有API调用都会自动处理错误：

- **401 未授权**：自动清除token并跳转到登录页
- **其他错误**：在catch块中捕获并显示错误信息

```typescript
try {
  const response = await login(data);
  // 处理成功
} catch (error) {
  // error.message 包含错误信息
  // error.code 包含错误代码
  // error.data 包含额外的错误数据
}
```

## Token 存储

- Token 自动保存到 `localStorage`
- Token 在浏览器刷新后会自动恢复
- 登出时自动清除 Token 和用户信息

## 环境配置

默认后端地址：`http://localhost:8080`

如需修改，设置环境变量 `VITE_API_BASE_URL` 或编辑 [http.ts](src/services/http.ts#L36)

## 常见问题

### Q: Token过期后会发生什么？
A: 系统会自动检测401错误，清除本地token，并跳转到登录页。

### Q: 如何在其他页面获取当前用户信息？
A: 使用 `getCurrentUser()` 方法或从 `useAuthStore` 中获取已缓存的用户信息。

### Q: 如何上传头像？
A: 使用 `api.upload()` 方法上传文件，然后调用 `updateUser()` 更新头像URL。
