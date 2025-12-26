import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 定义购物车商品接口
interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice?: number; // 原价（用于显示折扣）
  quantity: number;
  stock: number; // 库存
  selected: boolean;
  isbn: string;
}

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      bookId: 101,
      title: "《React设计模式与最佳实践》",
      author: "薛定谔的猫",
      coverImage: "https://picsum.photos/120/180?random=1",
      price: 68.50,
      originalPrice: 89.00,
      quantity: 1,
      stock: 10,
      selected: true,
      isbn: "9787115591207"
    },
    {
      id: 2,
      bookId: 102,
      title: "《Tailwind CSS实战指南》",
      author: "前端小能手",
      coverImage: "https://picsum.photos/120/180?random=2",
      price: 49.90,
      quantity: 2,
      stock: 15,
      selected: true,
      isbn: "9787121445678"
    },
    {
      id: 3,
      bookId: 103,
      title: "《JavaScript高级程序设计（第4版）》",
      author: "尼古拉斯·泽卡斯",
      coverImage: "https://picsum.photos/120/180?random=3",
      price: 119.00,
      originalPrice: 149.00,
      quantity: 1,
      stock: 5,
      selected: false,
      isbn: "9787115549655"
    },
    {
      id: 4,
      bookId: 104,
      title: "《TypeScript全面指南》",
      author: "TypeScript社区",
      coverImage: "https://picsum.photos/120/180?random=4",
      price: 78.00,
      quantity: 1,
      stock: 8,
      selected: true,
      isbn: "9787121345679"
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 计算是否全选
      const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
      setIsSelectAll(allSelected);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 更新全选状态
  useEffect(() => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    setIsSelectAll(allSelected);
  }, [cartItems]);

  // 计算总金额
  const calculateTotal = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const total = subtotal;
    return { subtotal, total };
  };

  // 计算选中的商品数量
  const selectedCount = cartItems.filter(item => item.selected).length;

  // 单个商品选择切换
  const toggleItemSelection = (id: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  // 全选/全不选
  const toggleSelectAll = () => {
    const newSelectAll = !isSelectAll;
    setIsSelectAll(newSelectAll);
    setCartItems(prev => prev.map(item => ({ ...item, selected: newSelectAll })));
  };

  // 修改商品数量
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        // 不能超过库存
        const finalQuantity = Math.min(newQuantity, item.stock);
        return { ...item, quantity: finalQuantity };
      }
      return item;
    }));
  };

  // 删除商品
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // 批量删除选中的商品
  const removeSelectedItems = () => {
    const selectedIds = cartItems.filter(item => item.selected).map(item => item.id);
    if (selectedIds.length === 0) {
      alert('请先选择要删除的商品');
      return;
    }
    
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 件商品吗？`)) {
      setCartItems(prev => prev.filter(item => !item.selected));
    }
  };

  // 去结算
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('请先选择要结算的商品');
      return;
    }
    
    // 在实际应用中，这里会将选中的商品信息传递到结算页面
    navigate('/checkout', { 
      state: { 
        items: selectedItems,
        ...calculateTotal()
      }
    });
  };

  // 继续购物
  const continueShopping = () => {
    navigate('/');
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            <i className="fa fa-shopping-cart mr-3"></i>购物车
          </h1>
          <p className="text-gray-500 mt-2">已选 {selectedCount} 件商品</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧商品列表 */}
            <div className="lg:w-2/3">
              {/* 商品列表头部 */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelectAll}
                      onChange={toggleSelectAll}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">全选</span>
                    <span className="ml-4 text-gray-500 text-sm">
                      ({selectedCount}/{cartItems.length})
                    </span>
                  </div>
                  <button 
                    onClick={removeSelectedItems}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <i className="fa fa-trash-can mr-1"></i>
                    删除选中
                  </button>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* 选择框 */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-5 w-5 text-blue-600 rounded"
                        />
                      </div>

                      {/* 图书封面 */}
                      <img 
                        src={item.coverImage} 
                        alt={item.title}
                        className="w-24 h-32 object-cover rounded shadow"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/120x160?text=Book+Cover';
                        }}
                      />

                      {/* 商品信息 */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                              <Link to={`/book/${item.bookId}`}>{item.title}</Link>
                            </h3>
                            <p className="text-gray-500 mt-1">
                              <i className="fa fa-user-pen mr-2 text-sm"></i>
                              {item.author}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              ISBN: {item.isbn}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              库存: {item.stock} 件
                            </p>
                          </div>

                          {/* 价格区域 */}
                          <div className="mt-3 md:mt-0">
                            <div className="flex items-center">
                              {item.originalPrice && (
                                <span className="text-gray-400 line-through mr-2">
                                  ¥{item.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-xl font-bold text-red-500">
                                ¥{item.price.toFixed(2)}
                              </span>
                            </div>
                            {item.originalPrice && (
                              <div className="mt-1">
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                  省¥{(item.originalPrice - item.price).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作区域 */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          {/* 数量调整 */}
                          <div className="flex items-center mb-3 md:mb-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <i className="fa fa-minus text-sm"></i>
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 text-center border-t border-b border-gray-300"
                              min="1"
                              max={item.stock}
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                              disabled={item.quantity >= item.stock}
                            >
                              <i className="fa fa-plus text-sm"></i>
                            </button>
                            <span className="text-gray-500 text-sm ml-2">
                              ×{item.quantity}
                            </span>
                          </div>

                          {/* 小计 */}
                          <div className="text-lg font-bold text-red-500 mb-3 md:mb-0">
                            ¥{(item.price * item.quantity).toFixed(2)}
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-500 hover:text-red-500 flex items-center"
                            >
                              <i className="fa fa-trash-can mr-1"></i>
                              删除
                            </button>
                            <Link 
                              to={`/book/${item.bookId}`}
                              className="text-blue-500 hover:text-blue-700 flex items-center"
                            >
                              <i className="fa fa-info-circle mr-1"></i>
                              详情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 继续购物按钮 */}
              <div className="mt-6">
                <button
                  onClick={continueShopping}
                  className="cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-arrow-left mr-2"></i>
                  继续购物
                </button>
              </div>
            </div>

            {/* 右侧结算区域 */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">订单结算</h2>

                {/* 金额明细 */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>商品总价</span>
                    <span>¥{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>应付总额</span>
                      <span className="text-red-500">¥{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 结算按钮 */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-md font-medium flex items-center justify-center transition-colors ${
                    selectedCount > 0 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <i className="fa fa-credit-card mr-2"></i>
                  {selectedCount > 0 ? `去结算 (${selectedCount} 件)` : '请选择商品'}
                </button>

                {/* 购物提示 */}
                <div className="mt-4 text-sm text-gray-500 space-y-2">
                  <p><i className="fa fa-check-circle mr-2 text-green-500"></i>正版保证</p>
                  <p><i className="fa fa-truck mr-2 text-blue-500"></i>全场满99元包邮</p>
                  <p><i className="fa fa-shield mr-2 text-orange-500"></i>7天无理由退货</p>
                  <p><i className="fa fa-clock mr-2 text-purple-500"></i>24小时内发货</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 空购物车状态 */
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <i className="fa fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">购物车空空如也</h2>
              <p className="text-gray-500 mb-6">快去挑选心仪的图书吧～</p>
              <div className="flex gap-4">
                <button
                  onClick={continueShopping}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-home mr-2"></i> 返回首页
                </button>
                <Link
                  to="/collections"
                  className="cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-heart mr-2"></i> 查看收藏
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;