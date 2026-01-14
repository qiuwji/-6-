import { api } from './http';

const isSuccessCode = (code: any) => code === 0 || code === 200;

/**
 * 购物车条目（前端友好）
 */
export interface CartItem {
  id: number;
  bookId: number;
  bookName: string;
  imageUrl?: string;
  author?: string;
  price?: number; // unit_price
  discountPrice?: number;
  quantity: number; // 和count一致
  count: number;
  subtotal?: number;
  selected?: boolean;
  addTime?: string;
  stock?: number;
  maxPurchase?: number;
}

/**
 * 购物车响应（API原始）
 */
interface CartApiResponse {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    list: Array<{
      id?: number;
      book_id?: number;
      book_title?: string;
      book_author?: string;
      book_cover?: string;
      unit_price?: number;
      count?: number;
      subtotal?: number;
      selected?: boolean;
      add_time?: string;
      stock?: number;
      max_purchase?: number;
    }>;
    summary?: {
      total_items: number;
      selected_items: number;
      total_price: number;
      selected_price: number;
    };
  };
}

export interface CartResponse {
  page: number;
  size: number;
  total: number;
  list: CartItem[];
  summary?: {
    totalItems: number;
    selectedItems: number;
    totalPrice: number;
    selectedPrice: number;
  };
}

/**
 * 查看购物车
 * @param onlySelected 是否只显示选中的商品，默认false
 */
export const getCart = async (onlySelected = false): Promise<CartResponse | null> => {
  try {
    const response = await api.get<CartApiResponse>('/cart', {
      params: {
        only_selected: onlySelected
      }
    });

    if (isSuccessCode(response.code) && response.data) {
      const data = response.data;
      const mapped: CartResponse = {
        page: data.page,
        size: data.size,
        total: data.total,
        list: data.list.map(it => ({
          id: it.id ?? 0,
          bookId: it.book_id ?? 0,
          bookName: it.book_title ?? '',
          author: it.book_author,
          imageUrl: it.book_cover,
          price: it.unit_price,
          quantity: it.count ?? 0,
          count: it.count ?? 0,
          subtotal: it.subtotal,
          selected: it.selected,
          addTime: it.add_time,
          stock: it.stock,
          maxPurchase: it.max_purchase
        })),
        summary: data.summary
          ? {
              totalItems: data.summary.total_items,
              selectedItems: data.summary.selected_items,
              totalPrice: data.summary.total_price,
              selectedPrice: data.summary.selected_price
            }
          : undefined
      };
      return mapped;
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
    // 新接口：POST /cart/{book_id}，body 包含 count
    const response = await api.post<any>(`/cart/${bookId}`, { count });
    return isSuccessCode(response.code);
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
    const response = await api.put<any>(`/cart/${cartItemId}`, { count, selected });
    return isSuccessCode(response.code);
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
    const response = await api.delete<any>(`/cart/${cartItemId}`);
    return isSuccessCode(response.code);
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
      api.put<any>(`/cart/${id}`, {
        selected
      })
    );

    const responses = await Promise.all(promises);
    return responses.every(r => isSuccessCode(r.code));
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
      const unit = item.discountPrice ?? item.price ?? 0;
      return total + unit * item.count;
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
