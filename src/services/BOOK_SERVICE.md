# 图书服务 API 文档

## 概述

`bookService.ts` 提供了所有与图书相关的API调用方法。所有请求都会自动包含认证Token（如果已登录）。

## 导出的方法

### 1. 获取图书列表

**函数签名**
```typescript
getBooks(params?: GetBooksParams): Promise<BooksListResponse>
```

**参数说明**
```typescript
interface GetBooksParams {
  page?: number;        // 页码（默认1）
  size?: number;        // 每页数量（默认20）
  sort?: 'new' | 'hot'; // 排序方式：new=新书，hot=热门
  category?: string;    // 分类名称
  keyword?: string;     // 搜索关键词
}
```

**返回数据**
```typescript
interface BooksListResponse {
  list: BookListItem[];
  total: number;
  page: number;
  size: number;
}

interface BookListItem {
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  discountPrice: number;
  points: number;
  featureLabel: string;
}
```

**使用示例**
```typescript
// 获取第1页，每页20本书
const response = await getBooks({ page: 1, size: 20 });

// 获取第2页
const response = await getBooks({ page: 2 });

// 搜索关键词
const response = await getBooks({ keyword: 'Java' });

// 获取分类下的书籍
const response = await getBooks({ category: '前端开发' });
```

---

### 2. 获取新书上架

**函数签名**
```typescript
getNewBooks(page?: number, size?: number): Promise<BooksListResponse>
```

**参数说明**
- `page`: 页码（默认1）
- `size`: 每页数量（默认20）

**使用示例**
```typescript
// 获取新书（第1页，每页20本）
const response = await getNewBooks();

// 获取新书（第2页，每页15本）
const response = await getNewBooks(2, 15);
```

---

### 3. 获取热门推荐

**函数签名**
```typescript
getHotBooks(page?: number, size?: number): Promise<BooksListResponse>
```

**参数说明**
- `page`: 页码（默认1）
- `size`: 每页数量（默认20）

**使用示例**
```typescript
// 获取热门书籍（第1页）
const response = await getHotBooks();

// 获取热门书籍（第3页，每页10本）
const response = await getHotBooks(3, 10);
```

---

### 4. 搜索图书

**函数签名**
```typescript
searchBooks(keyword: string, page?: number, size?: number): Promise<BooksListResponse>
```

**参数说明**
- `keyword`: 搜索关键词（必需）
- `page`: 页码（默认1）
- `size`: 每页数量（默认20）

**使用示例**
```typescript
// 搜索"JavaScript"相关书籍
const response = await searchBooks('JavaScript');

// 搜索并指定分页
const response = await searchBooks('Python', 2, 15);
```

---

### 5. 按分类获取图书

**函数签名**
```typescript
getBooksByCategory(category: string, page?: number, size?: number): Promise<BooksListResponse>
```

**参数说明**
- `category`: 分类名称（必需），例如："前端开发"、"后端开发"等
- `page`: 页码（默认1）
- `size`: 每页数量（默认20）

**使用示例**
```typescript
// 获取"前端开发"分类的书籍
const response = await getBooksByCategory('前端开发');

// 指定分页
const response = await getBooksByCategory('后端开发', 1, 20);
```

**支持的分类**
- 前端开发
- 后端开发
- 移动开发
- 数据库
- 人工智能
- 设计模式
- 测试运维
- 计算机基础
- 产品设计
- 项目管理

---

### 6. 获取图书详情

**函数签名**
```typescript
getBookDetail(id: number): Promise<BookDetail>
```

**参数说明**
- `id`: 图书ID（必需）

**返回数据**
```typescript
interface BookDetail {
  id: number;
  bookName: string;
  book_cover: string;
  author: string;
  publisher: string;
  ISBN: string;
  price: number;
  discount_rate: number;
  comment_count: number;
  total_score: number;
  stock: number;
  publish_time: string;
  category: string;
  isFavorited: boolean;
}
```

**使用示例**
```typescript
// 获取ID为1的图书详情
const detail = await getBookDetail(1);

console.log(detail.bookName);    // 书名
console.log(detail.author);      // 作者
console.log(detail.price);       // 价格
console.log(detail.stock);       // 库存
console.log(detail.isFavorited); // 是否收藏
```

---

## 在React组件中的使用

### 在页面加载时获取数据

```typescript
import { useEffect, useState } from 'react';
import { getBooks, getNewBooks, getHotBooks } from '@/services/bookService';

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await getBooks({ page: 1, size: 20 });
        
        if (response) {
          setBooks(response.list);
        }
      } catch (error) {
        console.error('加载失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {books.map(book => (
        <div key={book.bookId}>
          <img src={book.imageUrl} alt={book.bookName} />
          <h3>{book.bookName}</h3>
          <p>{book.author}</p>
          <span>¥{book.discountPrice}</span>
        </div>
      ))}
    </div>
  );
}
```

### 搜索功能

```typescript
import { useState } from 'react';
import { searchBooks } from '@/services/bookService';

function SearchBooks() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      const response = await searchBooks(keyword);
      
      if (response) {
        setResults(response.list);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="搜索图书..."
      />
      <button onClick={handleSearch}>搜索</button>

      {loading && <p>搜索中...</p>}
      
      {results.map(book => (
        <div key={book.bookId}>
          <h4>{book.bookName}</h4>
          <p>作者: {book.author}</p>
          <p>价格: ¥{book.discountPrice}</p>
        </div>
      ))}
    </div>
  );
}
```

### 分类浏览

```typescript
import { useEffect, useState } from 'react';
import { getBooksByCategory } from '@/services/bookService';

function CategoryBooks({ categoryName }) {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadBooks = async () => {
      const response = await getBooksByCategory(categoryName, currentPage, 20);
      
      if (response) {
        setBooks(response.list);
        setTotal(response.total);
      }
    };

    loadBooks();
  }, [categoryName, currentPage]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h2>{categoryName}</h2>
      
      {/* 书籍列表 */}
      <div className="book-grid">
        {books.map(book => (
          <div key={book.bookId} className="book-card">
            <img src={book.imageUrl} alt={book.bookName} />
            <h3>{book.bookName}</h3>
            <p>{book.author}</p>
            <p className="price">¥{book.discountPrice}</p>
            {book.featureLabel && (
              <span className="label">{book.featureLabel}</span>
            )}
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        
        <span>{currentPage} / {totalPages}</span>
        
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

### 获取图书详情

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookDetail } from '@/services/bookService';

function BookDetailPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const detail = await getBookDetail(parseInt(bookId));
        setBook(detail);
      } catch (error) {
        console.error('加载失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [bookId]);

  if (loading) return <div>加载中...</div>;
  if (!book) return <div>图书未找到</div>;

  return (
    <div className="book-detail">
      <img src={book.book_cover} alt={book.bookName} />
      
      <div className="info">
        <h1>{book.bookName}</h1>
        <p>作者: {book.author}</p>
        <p>出版社: {book.publisher}</p>
        <p>ISBN: {book.ISBN}</p>
        <p>出版时间: {book.publish_time}</p>
        <p>分类: {book.category}</p>
        
        <div className="price-info">
          <span className="original-price">￥{book.price}</span>
          <span className="discount">折扣: {(book.discount_rate * 100).toFixed(0)}%</span>
        </div>

        <div className="rating">
          <span>评分: {book.total_score}</span>
          <span>评论数: {book.comment_count}</span>
        </div>

        <p className="stock">库存: {book.stock > 0 ? '有货' : '缺货'}</p>

        {book.isFavorited ? (
          <button className="favorited">♥ 已收藏</button>
        ) : (
          <button>♡ 收藏</button>
        )}
      </div>
    </div>
  );
}
```

---

## 错误处理

所有API调用都会自动处理错误，如果出错会抛出异常：

```typescript
try {
  const response = await getBooks({ page: 1 });
  // 处理成功
} catch (error) {
  // error.message 包含错误信息
  // error.code 包含错误代码
  console.error('获取图书列表失败:', error.message);
}
```

## 常见问题

### Q: 如何获取指定分类的书籍？
A: 使用 `getBooksByCategory(categoryName)` 方法，categoryName参数是分类名称。

### Q: 如何实现分页？
A: 所有列表API都支持 `page` 和 `size` 参数来控制分页。

### Q: 价格信息在哪里？
A: 列表API返回 `discountPrice`（折扣价），详情API返回 `price`（原价）和 `discount_rate`（折扣率）。

### Q: 如何判断书籍是否已收藏？
A: 使用 `getBookDetail()` 方法获取详情，返回的 `isFavorited` 字段表示是否已收藏。

### Q: 如何检查库存？
A: 详情API返回 `stock` 字段，大于0表示有货。

---

**文档更新时间**: 2026年1月9日
