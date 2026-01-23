import api from './http';

export interface BookListItem {
  id: number;
  bookName: string;
  bookCover: string;
  author: string;
  price: number;
  discountRate: number;
  totalScore: number;
  featureLabel: string | null;
  category: string | null;  
}

/**
 * 图书列表响应（对应API返回的data字段）
 */
export interface BooksListData {
  list: BookListItem[];
  total: number;
  page: number;
  size: number;
}

/**
 * 获取图书列表请求参数
 */
export interface GetBooksParams {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
  category?: string;
  categorys?: string;
  minPrice?: number;
  maxPrice?: number;
  scoreMin?: number;
}

/**
 * 图书详情数据
 */
export interface BookDetailData {
  id: number;
  bookName: string;
  bookCover: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
  discountRate: number;
  commentCount: number;
  totalScore: number;
  stock: number;
  publishTime: string;
  category: string;
  isFavorited: boolean;
}

export const getNewBooks = (page: number = 1, size: number = 8): Promise<BooksListData> => {
  const url = `/books?page=${page}&size=${size}&sort=new`;
  return api.get<BooksListData>(url);
};

export const getHotBooks = (page: number = 1, size: number = 8): Promise<BooksListData> => {
  const url = `/books?page=${page}&size=${size}&sort=hot`;
  return api.get<BooksListData>(url);
};

/**
 * 获取图书列表
 */
export const getBooks = (params: GetBooksParams = {}): Promise<BooksListData> => {
  const defaultParams: any = {
    page: params.page || 1,
    size: params.size || 20,
    ...params,
  };

  Object.keys(defaultParams).forEach(
    key => defaultParams[key] === undefined && delete defaultParams[key]
  );

  return api.get<BooksListData>('/books', {
    params: defaultParams,
  });
};

/**
 * 按分类获取图书（单分类）
 */
export const getBooksByCategory = (category: string, page: number = 1, size: number = 20): Promise<BooksListData> => {
  return api.get<BooksListData>('/books', {
    params: { 
      category, 
      page, 
      size 
    },
  });
};

export const searchBooks = (params: GetBooksParams): Promise<BooksListData> => {
  const defaultParams: any = {
    page: params.page || 1,
    size: params.size || 20,
    ...params,
  };

  // 清理 undefined 参数
  Object.keys(defaultParams).forEach(
    key => defaultParams[key] === undefined && delete defaultParams[key]
  );

  // 直接构建查询字符串，避免 axios 的嵌套参数
  const queryString = Object.keys(defaultParams)
    .filter(key => defaultParams[key] !== null && defaultParams[key] !== undefined)
    .map(key => {
      const value = defaultParams[key];
      // 处理数组类型的参数（如 categorys）
      if (Array.isArray(value)) {
        return `${key}=${value.join(',')}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  const url = `/books${queryString ? '?' + queryString : ''}`;
  
  return api.get<BooksListData>(url);
};

/**
 * 获取图书详情
 */
export const getBookDetail = (id: number): Promise<BookDetailData> => {
  return api.get<BookDetailData>(`/books/${id}`);
};