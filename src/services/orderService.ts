// orderService.ts
import { api } from './http';

/**
 * 订单商品项
 */
export interface OrderItem {
  bookId: number;
  bookName: string;
  quantity: number;
  stock: number;
  bookCover: string;
  author: string;
  isbn: string;
  price: string;
}

/**
 * 订单详情
 */
export interface OrderDetail {
  totalAmount: number;
  actualAmount: number;
  shippingAddress: string;
  phone: string;
  receiver: string;
  paymentStatus: string;
  paymentTime: string;
  createTime: string;
  items: OrderItem[];
}

/**
 * 订单列表项
 */
export interface OrderListItem {
  orderNo: string;
  totalAmount: number;
  actualAmount: number;
  shippingAddress: string;
  paymentStatus: string;
  createTime: string;
}

/**
 * 订单列表响应
 */
export interface OrderListResponse {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    list: OrderListItem[];
  };
}

/**
 * 订单详情响应
 */
export interface OrderDetailResponse {
  code: number;
  msg: string;
  data: OrderDetail;
}

/**
 * 下单请求体 - 根据接口文档修改
 */
export interface CreateOrderRequest {
  items: Array<{
    book_id: number;
    quantity: number; // 注意：接口文档中这里是 quantity，不是 count
  }>;
  shipping_address: string; // 收货地址（必需）
  phone: string;           // 手机号（必需）
  receiver: string;        // 收货人（必需）
}

/**
 * 下单响应
 */
export interface CreateOrderResponse {
  code: number;
  msg: string;
  data: object | null;
}

/**
 * 创建订单时需要的参数
 */
export interface CreateOrderParams {
  items: Array<{ book_id: number; quantity: number }>;
  shippingAddress: string;
  phone: string;
  receiver: string;
}

/**
 * 立即下单
 * @param params 订单参数
 * @returns 订单创建结果
 */
export const createOrder = async (
  params: CreateOrderParams
): Promise<object | null> => {
  try {
    console.log('📦 创建订单参数:', params);
    
    // 构造符合接口文档的请求体
    const requestBody: CreateOrderRequest = {
      items: params.items.map(item => ({
        book_id: item.book_id,
        quantity: item.quantity
      })),
      shipping_address: params.shippingAddress,
      phone: params.phone,
      receiver: params.receiver
    };

    console.log('📤 发送的请求体:', requestBody);

    const response = await api.post<CreateOrderResponse>(
      '/orders',
      requestBody
    );

    console.log('✅ 下单响应:', response);
    
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.error('❌ 创建订单失败:', error);
    throw error;
  }
};

/**
 * 从购物车创建订单
 * @param cartItems 购物车商品列表
 * @param shippingInfo 收货信息
 */
export const createOrderFromCart = async (
  cartItems: Array<{ book_id: number; quantity: number }>, 
  shippingInfo: {
    shippingAddress: string;
    phone: string;
    receiver: string;
  }
): Promise<object | null> => {
  try {
    console.log('📦 从购物车创建订单，商品:', cartItems);
    
    const validatedItems = cartItems.map(item => ({
      book_id: item.book_id, 
      quantity: item.quantity
    }));
    
    console.log('✅ 验证后的商品:', validatedItems);
    
    return await createOrder({
      items: validatedItems,
      ...shippingInfo
    });
  } catch (error) {
    console.error('❌ 从购物车创建订单失败:', error);
    throw error;
  }
};

/**
 * 获取我的订单列表
 * @param page 页码，默认1
 * @param size 每页数量，默认10
 * @param status 订单状态筛选，可选
 */
export const getOrders = async (
  page = 1,
  size = 10,
  status?: number
): Promise<OrderListResponse['data'] | null> => {
  try {
    const params: any = { page, size };
    if (status !== undefined) {
      params.status = status;
    }

    const response = await api.get<OrderListResponse>('/orders', { params });

    if (response.code === 0 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('获取订单列表失败:', error);
    throw error;
  }
};

/**
 * 获取订单详情
 * @param orderId 订单ID
 */
export const getOrderDetail = async (orderId: string): Promise<OrderDetail | null> => {
  try {
    const response = await api.get<OrderDetailResponse>(`/orders/${orderId}`);

    if (response.code === 0 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    throw error;
  }
};

/**
 * 取消订单
 * @param orderId 订单ID
 */
export const cancelOrder = async (orderId: string): Promise<boolean> => {
  try {
    const response = await api.put<{ code: number; msg: string; data: object }>(
      `/orders/${orderId}/cancel`,
      {}
    );

    if (response.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('取消订单失败:', error);
    throw error;
  }
};

/**
 * 获取待支付订单
 */
export const getPendingOrders = async (): Promise<OrderListItem[]> => {
  try {
    const orders = await getOrders(1, 100, 0); // 假设0表示待支付
    return orders?.list || [];
  } catch (error) {
    console.error('获取待支付订单失败:', error);
    return [];
  }
};

/**
 * 获取已完成订单
 */
export const getCompletedOrders = async (): Promise<OrderListItem[]> => {
  try {
    const orders = await getOrders(1, 100, 2); // 假设2表示已完成
    return orders?.list || [];
  } catch (error) {
    console.error('获取已完成订单失败:', error);
    return [];
  }
};