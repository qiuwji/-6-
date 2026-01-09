import { api } from './http';

/**
 * 购物车条目
 */
export interface CartItem {
  id: number;
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  price: number;
  count: number;
  selected: boolean;
  discountPrice: number;
}

/**
 * 购物车响应
 */
export interface CartResponse {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    list: CartItem[];
  };
}

/**
 * 查看购物车
 * @param onlySelected 是否只显示选中的商品，默认false
 */
export const getCart = async (onlySelected = false): Promise<CartResponse['data'] | null> => {
  try {
    const response = await api.get<CartResponse>('/cart', {
      params: {
        only_selected: onlySelected
      }
    });

    if (response.code === 0 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('获取购物车失败:', error);
    throw error;
  }
};

/**
 * 加入购物车
 * @param bookId 书籍ID
 * @param count 数量，默认1
 */
export const addToCart = async (bookId: number, count = 1): Promise<boolean> => {
  try {
    const response = await api.post<{ code: number; msg: string; data: object }>(
      '/cart',
      { book_id: bookId, count }
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('加入购物车失败:', error);
    throw error;
  }
};

/**
 * 更新购物车条目数量
 * @param cartItemId 购物车条目ID
 * @param count 新数量
 * @param selected 是否选中
 */
export const updateCartItem = async (
  cartItemId: number,
  count: number,
  selected = true
): Promise<boolean> => {
  try {
    const response = await api.put<{ code: number; msg: string; data: object }>(
      `/cart/${cartItemId}`,
      { count, selected }
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('更新购物车条目失败:', error);
    throw error;
  }
};

/**
 * 删除购物车条目
 * @param cartItemId 购物车条目ID
 */
export const removeFromCart = async (cartItemId: number): Promise<boolean> => {
  try {
    const response = await api.delete<{ code: number; msg: string; data: object }>(
      `/cart/${cartItemId}`
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('删除购物车条目失败:', error);
    throw error;
  }
};

/**
 * 清空购物车（删除全部）
 */
export const clearCart = async (): Promise<boolean> => {
  try {
    const cart = await getCart();
    if (!cart || cart.list.length === 0) {
      return true;
    }

    // 逐个删除购物车条目
    for (const item of cart.list) {
      await removeFromCart(item.id);
    }
    return true;
  } catch (error) {
    console.error('清空购物车失败:', error);
    throw error;
  }
};

/**
 * 批量更新购物车条目（选中状态）
 * @param itemIds 购物车条目ID数组
 * @param selected 是否选中
 */
export const batchUpdateCart = async (itemIds: number[], selected = true): Promise<boolean> => {
  try {
    const promises = itemIds.map(id =>
      api.put<{ code: number; msg: string; data: object }>(`/cart/${id}`, {
        selected
      })
    );

    const responses = await Promise.all(promises);
    return responses.every(r => r.code === 0);
  } catch (error) {
    console.error('批量更新购物车失败:', error);
    throw error;
  }
};

/**
 * 获取购物车中选中的商品总金额
 */
export const getCartTotal = async (): Promise<{ amount: number; items: CartItem[] } | null> => {
  try {
    const cart = await getCart();
    if (!cart) return null;

    const selectedItems = cart.list.filter(item => item.selected);
    const amount = selectedItems.reduce((total, item) => {
      return total + item.discountPrice * item.count;
    }, 0);

    return {
      amount,
      items: selectedItems
    };
  } catch (error) {
    console.error('计算购物车总额失败:', error);
    return null;
  }
};
