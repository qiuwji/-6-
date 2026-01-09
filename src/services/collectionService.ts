import { api } from './http';

/**
 * 收藏记录项
 */
export interface CollectionItem {
  id: number;
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  price: number;
  discountPrice: number;
  collectTime: string;
}

/**
 * 收藏列表响应
 */
export interface CollectionsListResponse {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    list: CollectionItem[];
  };
}

/**
 * 查看我的收藏
 * @param page 页码，默认1
 * @param size 每页数量，默认20
 * @param sortBy 排序字段，如'collect_time'
 * @param order 排序方式，'asc'或'desc'
 */
export const getCollections = async (
  page = 1,
  size = 20,
  sortBy = 'collect_time',
  order = 'desc'
): Promise<CollectionsListResponse['data'] | null> => {
  try {
    const response = await api.get<CollectionsListResponse>('/users/me/collections', {
      params: {
        page,
        size,
        sort_by: sortBy,
        order
      }
    });

    if (response.code === 0 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    throw error;
  }
};

/**
 * 添加收藏
 * @param bookId 书籍ID
 */
export const addCollection = async (bookId: number): Promise<boolean> => {
  try {
    const response = await api.post<{ code: number; msg: string; data: object }>(
      '/users/me/collections',
      { book_id: bookId }
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('添加收藏失败:', error);
    throw error;
  }
};

/**
 * 取消收藏
 * @param bookId 书籍ID
 */
export const removeCollection = async (bookId: number): Promise<boolean> => {
  try {
    const response = await api.delete<{ code: number; msg: string; data: object }>(
      `/users/me/collections/${bookId}`
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('取消收藏失败:', error);
    throw error;
  }
};

/**
 * 检查是否已收藏（根据服务实现自动判断）
 * @param bookId 书籍ID
 */
export const isCollected = async (bookId: number): Promise<boolean> => {
  try {
    const collections = await getCollections(1, 100);
    if (collections) {
      return collections.list.some(item => item.bookId === bookId);
    }
    return false;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};
