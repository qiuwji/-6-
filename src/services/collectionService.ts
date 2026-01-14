import { api } from './http';

const isSuccessCode = (code: any) => code === 0 || code === 200;

/**
 * 收藏记录项
 */
export interface CollectionItem {
  id: number;
  bookId: number;
  bookName: string;
  author: string;
  imageUrl?: string;
  bookPrice?: number;
  collectTime: string;
}

/**
 * 收藏列表响应
 */
// API 原始返回类型（snake_case）
interface CollectionsApiResponse {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    list: Array<{
      id: number;
      book_id: number;
      book_title: string;
      book_author: string;
      book_cover?: string;
      book_price?: number;
      collect_time: string;
    }>;
  };
}

export interface CollectionsListResponse {
  page: number;
  size: number;
  total: number;
  list: CollectionItem[];
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
): Promise<CollectionsListResponse | null> => {
  try {
    // 注意：后端文档中路径为 /user/me/collections
    const response = await api.get<CollectionsApiResponse>('/user/me/collections', {
      params: {
        page,
        size,
        sort_by: sortBy,
        order
      }
    });

    if (isSuccessCode(response.code) && response.data) {
      const mapped: CollectionsListResponse = {
        page: response.data.page,
        size: response.data.size,
        total: response.data.total,
        list: response.data.list.map(it => ({
          id: it.id,
          bookId: it.book_id,
          bookName: it.book_title,
          author: it.book_author,
          imageUrl: it.book_cover,
          bookPrice: it.book_price,
          collectTime: it.collect_time
        }))
      };
      return mapped;
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
export const addCollection = async (bookId: number): Promise<{ collectionId?: number; bookId?: number; collectTime?: string } | null> => {
  try {
    // 新接口：POST /user/me/collections/{book_id}
    const response = await api.post<any>(`/user/me/collections/${bookId}`, {});

    if (isSuccessCode(response.code)) {
      // 期望返回 { collection_id, book_id, collect_time }
      const d = response.data || {};
      return {
        collectionId: d.collection_id ?? d.collectionId,
        bookId: d.book_id ?? d.bookId,
        collectTime: d.collect_time ?? d.collectTime
      };
    }
    return null;
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
    const response = await api.delete<any>(`/user/me/collections/${bookId}`);

    return isSuccessCode(response.code);
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
