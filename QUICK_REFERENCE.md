# 🚀 快速参考 - API 集成指南

## 📌 10秒快速开始

### 1. 确保后端运行
```
http://localhost:8080
```

### 2. 启动前端
```bash
npm run dev
```

### 3. 访问应用
```
http://localhost:5173
```

---

## 📚 服务导入

### 用户服务
```typescript
import { login, register, getCurrentUser } from '@/services/userService';
```

### 图书服务
```typescript
import { 
  getBooks, 
  getHotBooks, 
  getNewBooks, 
  searchBooks, 
  getBooksByCategory,
  getBookDetail 
} from '@/services/bookService';
```

### 认证状态
```typescript
import { useAuthStore, useAuthUser, useIsLogin } from '@/store/useAuthStore';
```

---

## 💡 常用代码片段

### 获取列表
```typescript
const response = await getBooks({ page: 1, size: 20 });
setBooks(response.list);
```

### 搜索
```typescript
const response = await searchBooks('JavaScript', 1, 20);
```

### 分类
```typescript
const response = await getBooksByCategory('前端开发', 1, 20);
```

### 详情
```typescript
const detail = await getBookDetail(123);
```

### 登录
```typescript
await login({ account: 'user@example.com', password: '123456' });
```

### 注册
```typescript
await register({ username: 'john', email: 'john@example.com', password: '123456' });
```

---

## 🎯 API 端点速查

| 功能 | 端点 | 参数 |
|------|------|------|
| 登录 | `POST /auth/login` | account, password |
| 注册 | `POST /auth/register` | username, email, password |
| 当前用户 | `GET /users/me` | - |
| 修改用户 | `PUT /users/me` | username?, avatarUrl? |
| 图书列表 | `GET /books` | page?, size?, sort?, category?, keyword? |
| 图书详情 | `GET /books/{id}` | id |

---

## 🔐 Token 管理

### 自动添加
所有请求都会自动添加 `Authorization: Bearer <token>`

### 手动设置
```typescript
import api from '@/services/http';
api.setToken('your-token');
```

### 清除
```typescript
api.clearToken();
```

---

## ⚠️ 错误处理模板

```typescript
try {
  const response = await getBooks();
  // 处理成功
} catch (error) {
  if (error.code === 401) {
    // 未授权，重定向到登录
    navigate('/login');
  } else {
    // 显示错误信息
    alert(error.message);
  }
}
```

---

## 🔄 React Hook 模板

```typescript
import { useEffect, useState } from 'react';
import { getBooks } from '@/services/bookService';

function MyComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await getBooks({ page: 1 });
        if (response) setBooks(response.list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <ul>
      {books.map(book => (
        <li key={book.bookId}>{book.bookName}</li>
      ))}
    </ul>
  );
}
```

---

## 📱 分页实现

```typescript
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const pageSize = 20;

useEffect(() => {
  getBooks({ page, size: pageSize }).then(res => {
    setBooks(res.list);
    setTotal(res.total);
  });
}, [page]);

const totalPages = Math.ceil(total / pageSize);

// 上一页
<button onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</button>

// 下一页
<button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>下一页</button>
```

---

## 🎨 类型快速参考

### 图书列表项
```typescript
{
  bookId: number,
  bookName: string,
  imageUrl: string,
  author: string,
  discountPrice: number,
  points: number,
  featureLabel: string
}
```

### 用户信息
```typescript
{
  id: string | number,
  username: string,
  email?: string | null,
  avatarUrl: string | null
}
```

---

## 🔍 调试技巧

### 查看请求日志
```typescript
// 在 http.ts 请求拦截器已打印
```

### 查看 Token
```javascript
// 浏览器控制台
JSON.parse(localStorage.getItem('auth-cart-store')).token
```

### 查看用户信息
```javascript
// 浏览器控制台
JSON.parse(localStorage.getItem('auth-cart-store')).state.user
```

### 清除本地存储
```javascript
// 清除 Token 和用户信息
localStorage.removeItem('auth-cart-store');
```

---

## 📊 API 响应结构

### 成功响应
```json
{
  "code": 0,
  "msg": "success",
  "data": { /* 实际数据 */ }
}
```

### 失败响应
```json
{
  "code": 400,
  "msg": "error message",
  "data": null
}
```

---

## 🎯 常见场景

### 场景1: 首页加载热门和新书
```typescript
useEffect(() => {
  Promise.all([
    getHotBooks(1, 8),
    getNewBooks(1, 8)
  ]).then(([hotRes, newRes]) => {
    setHotBooks(hotRes.list);
    setNewBooks(newRes.list);
  });
}, []);
```

### 场景2: 实时搜索
```typescript
const [keyword, setKeyword] = useState('');

useEffect(() => {
  if (!keyword) return;
  
  const timer = setTimeout(async () => {
    const res = await searchBooks(keyword);
    setResults(res.list);
  }, 300); // 防抖
  
  return () => clearTimeout(timer);
}, [keyword]);
```

### 场景3: 分类筛选
```typescript
const handleCategoryChange = async (category) => {
  const res = await getBooksByCategory(category);
  setBooks(res.list);
};
```

### 场景4: 需要登录才能访问
```typescript
function ProtectedPage() {
  const { isLogin } = useAuthUser();
  const navigate = useNavigate();

  if (!isLogin) {
    navigate('/login');
    return null;
  }

  return <div>受保护的内容</div>;
}
```

---

## 📖 完整文档

- 📘 [用户服务文档](./src/services/README.md)
- 📗 [图书服务文档](./src/services/BOOK_SERVICE.md)
- 📕 [集成报告](./COMPLETE_INTEGRATION_REPORT.md)

---

## ✨ 记住这些

✅ Token 自动管理，无需手动操作  
✅ 所有错误都有 error.message 描述  
✅ 401 错误会自动跳转登录  
✅ 所有列表API都支持分页  
✅ 用 useAuthStore 获取登录状态  

---

**快速参考卡 v1.0** | 最后更新: 2026-01-09
