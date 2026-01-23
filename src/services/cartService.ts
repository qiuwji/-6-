import { useAuthStore } from '@/store/useAuthStore';
import { api } from './http';

/**
 * 购物车条目（前端友好）
 */
export interface CartItem {
  id: number;
  bookId: number;
  bookName: string;
  imageUrl?: string;
  author?: string;
  price?: number;
  discountPrice?: number;
  quantity: number;
  count: number;
  selected?: boolean;
  addTime?: string;
  stock?: number;
}

/**
 * 加入购物车返回的响应数据
 */
export interface AddToCartResponse {
  cartItemId: number;   // 购物车条目ID
  bookId: number;       // 图书ID
  count: number;        // 购买数量
  addTime: string;      // 添加时间
}

/**
 * 注意：api.ts拦截器已经处理了响应，返回的是驼峰化的 data.data 部分
 * 所以这里直接定义转换后的数据结构
 */
export interface CartResponse {
  page: number;
  size: number;
  total: number;
  list: Array<{
    cartItemId?: number;  
    bookId?: number;        
    bookTitle?: string;    
    bookCover?: string;   
    bookPrice?: number;    
    count?: number;       
    addTime?: string;     
  }>;
}

/**
 * 查看购物车
 */
export const getCart = async (onlySelected = false): Promise<{list: CartItem[], total: number} | null> => {
  try {
    console.log('🛒 getCart 被调用');
    
    // api.ts 拦截器处理后，response 直接就是 data.data 部分
    const response = await api.get<CartResponse>('/cart', {
      params: { only_selected: onlySelected }
    });

    console.log('📦 获取到的购物车数据（已驼峰化）:', response);

    if (response) {
      // 将驼峰化的数据映射到前端格式
      const mappedList = response.list.map(item => ({
        id: item.cartItemId || 0,
        bookId: item.bookId || 0,
        bookName: item.bookTitle || '未知书名',
        imageUrl: item.bookCover || '',
        author: '未知作者', // 后端没有返回
        price: item.bookPrice || 0,
        discountPrice: item.bookPrice || 0,
        quantity: item.count || 0,
        count: item.count || 0,
        selected: false, // 后端没有返回
        addTime: item.addTime,
        stock: 99 // 默认库存
      }));

      console.log('✅ 映射后的购物车列表:', mappedList);
      
      return {
        list: mappedList,
        total: response.total || mappedList.length
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ 获取购物车失败:', error);
    throw error;
  }
};

/**
 * 加入购物车
 * @param bookId 图书ID
 * @param count 购买数量，默认1
 * @returns 加入后的购物车条目数量，失败返回-1
 */
export const addToCart = async (bookId: number, count = 1): Promise<number> => {
  try {
    console.log(`🛒 加入购物车: bookId=${bookId}, count=${count}`);
    
    const response = await api.post<AddToCartResponse>(`/cart/${bookId}`, { 
      book_id: bookId,  
      count 
    });

    console.log('加入购物车响应:', response);

    return response.count;
  } catch (error) {
    console.error('❌ 加入购物车失败:', error);
    return -1;
  }
};

/**
 * 更新购物车条目
 */
export const updateCartItem = async (
  cartItemId: number,
  count: number,
  selected = true
): Promise<boolean> => {
  try {
    await api.put(`/cart/${cartItemId}`, { count, selected });
    return true;
  } catch (error) {
    console.error('❌ 更新购物车失败:', error);
    return false;
  }
};

/**
 * 删除购物车条目
 */
export const removeFromCart = async (cartItemId: number): Promise<boolean> => {
  try {
    await api.delete(`/cart/${cartItemId}`);
    return true;
  } catch (error) {
    console.error('❌ 删除购物车失败:', error);
    return false;
  }
};

/**
 * 获取购物车条目数量并更新到 store
 * @returns 购物车条目数量（不同商品的数量）
 */
export const fetchAndUpdateCartCount = async (): Promise<number> => {
  try {
    const cartData = await getCart();
    
    // 计算条目数量：直接获取 list 的长度
    const itemCount = cartData?.list?.length || 0;
    
    // 更新到 Zustand store
    const { updateCartCount } = useAuthStore.getState();
    updateCartCount(itemCount);
    
    console.log(`🛒 更新购物车条目数量: ${itemCount} 个商品`);
    
    return itemCount;
  } catch (error) {
    console.error('❌ 获取购物车数量失败:', error);
    const { updateCartCount } = useAuthStore.getState();
    updateCartCount(0); // 失败时重置为0
    return 0;
  }
};
