import { api } from './http';

/**
 * 前端使用的收藏项（camelCase，已与拦截器输出对齐）
 */
export interface CollectionItem {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  bookPrice?: number;
  collectTime: string;
}

/**
 * 收藏列表分页响应
 */
export interface CollectionsListResponse {
  page: number;
  size: number;
  total: number;
  list: CollectionItem[];
}

/**
 * 查看我的收藏
 */
export const getCollections = async (
  page = 1,
  size = 20,
  sortBy = 'collect_time',
  order = 'desc'
): Promise<CollectionsListResponse> => {
  /**
   * ⚠️ 关键点：
   * api.get 返回的已经是 data.data（并且 camelCase 过）
   * 不要再 response.data.data
   */
  return api.get<CollectionsListResponse>(
    '/user/me/collections',
    {
      page,
      size,
      sort_by: sortBy,
      order
    }
  );
};

/**
 * 添加收藏
 * 后端一般返回：
 * { collectionId, bookId, collectTime }
 * 如果后端不返回，前端当前逻辑也不依赖
 */
export const addCollection = async (
  bookId: number
): Promise<{
  collectionId?: number;
  bookId?: number;
  collectTime?: string;
}> => {
  return api.post(`/user/me/collections/${bookId}`);
};

/**
 * 取消收藏
 */
export const removeCollection = async (bookId: number): Promise<boolean> => {
  await api.delete(`/user/me/collections/${bookId}`);
  return true;
};

/**
 * 判断是否已收藏
 * ⚠️ 简单版实现：拉一页判断（收藏量小完全 OK）
 */
export const isCollected = async (bookId: number): Promise<boolean> => {
  const res = await getCollections(1, 100);
  return res.list.some(item => item.bookId === bookId);
};
