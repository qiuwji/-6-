import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Modal } from 'antd';
import { createOrderFromCart } from '@/services/orderService';

// 与购物车页面使用相同的键名
const SELECTED_CART_ITEMS_KEY = 'selected_cart_items';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [itemDetails, setItemDetails] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // 从本地存储获取购物车选中的商品
    const items = localStorage.getItem(SELECTED_CART_ITEMS_KEY);
    console.log('从本地存储读取的商品:', items);
    
    if (items) {
      try {
        const parsedItems = JSON.parse(items);
        console.log('解析后的商品数据:', parsedItems);
        
        // 验证数据格式
        if (!Array.isArray(parsedItems)) {
          throw new Error('商品数据格式错误');
        }
        
        // 检查是否包含必要的字段
        const isValidItems = parsedItems.every(item => 
          item && typeof item.book_id === 'number' && typeof item.quantity === 'number'
        );
        
        if (!isValidItems) {
          throw new Error('商品数据缺少必要字段');
        }
        
        // 设置订单项目（原样传递）
        setOrderItems(parsedItems);
        
        // 设置显示详情（用于界面展示）
        setItemDetails(parsedItems.map(item => ({
          bookId: item.book_id,
          quantity: item.quantity
        })));
        
      } catch (error) {
        console.error('解析商品数据失败:', error);
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const handleSubmit = async (values: any) => {
    Modal.confirm({
      title: '确认下单',
      content: '请确认收货信息无误，确认后将创建订单',
      okText: '确认下单',
      cancelText: '返回修改',
      onOk: async () => {
        try {
          setLoading(true);
          
          console.log('📤 提交订单，商品列表:', orderItems);
          console.log('📤 收货信息:', values);
          
          // 直接使用从本地存储获取的orderItems
          const result = await createOrderFromCart(orderItems, {
            shippingAddress: values.shippingAddress,
            phone: values.phone,
            receiver: values.receiver
          });
          
          // 1. 清空本地存储的选中商品
          localStorage.removeItem(SELECTED_CART_ITEMS_KEY);
          
          // 2. 显示成功消息
          message.success('订单创建成功！');
          
          // 3. 跳转到首页
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } catch (error: any) {
          console.error('下单失败:', error);
          // 显示具体的错误信息
          const errorMsg = error?.message || error?.data?.msg || '下单失败，请稍后重试';
          message.error(errorMsg);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleReturnHome = () => {
    // 关闭模态框并返回首页
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">结算页面</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* 商品信息卡片 */}
          {itemDetails.length > 0 && (
            <Card title="商品清单" className="mb-4">
              <div className="space-y-2">
                <p className="text-gray-600">共 {itemDetails.length} 件商品</p>
                <ul className="space-y-1">
                  {itemDetails.map((item, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">
                        商品ID: <span className="font-medium">{item.bookId}</span>
                      </span>
                      <span className="text-blue-600 font-medium">
                        数量: {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
          
          <Card title="收货信息">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                receiver: '',
                phone: '',
                shippingAddress: ''
              }}
            >
              <Form.Item
                label="收货人"
                name="receiver"
                rules={[
                  { required: true, message: '请输入收货人姓名' },
                  { min: 2, message: '姓名至少2个字符' },
                  { max: 20, message: '姓名最多20个字符' }
                ]}
              >
                <Input 
                  placeholder="请输入收货人姓名" 
                  maxLength={20}
                />
              </Form.Item>
              
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
                ]}
              >
                <Input 
                  placeholder="请输入11位手机号" 
                  maxLength={11}
                />
              </Form.Item>
              
              <Form.Item
                label="收货地址"
                name="shippingAddress"
                rules={[
                  { required: true, message: '请输入收货地址' },
                  { min: 5, message: '地址至少5个字符' },
                  { max: 100, message: '地址最多100个字符' }
                ]}
              >
                <Input.TextArea 
                  placeholder="请输入详细收货地址（省市区街道门牌号）" 
                  rows={3}
                  maxLength={100}
                  showCount
                />
              </Form.Item>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button 
                  type="default"
                  onClick={() => navigate('/cart')}
                >
                  返回购物车
                </Button>
                
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                  disabled={orderItems.length === 0}
                  size="large"
                  className="min-w-30"
                >
                  {loading ? '提交中...' : '提交订单'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      {/* 成功模态框 */}
      <Modal
        title="🎉 订单创建成功"
        open={showSuccessModal}
        onOk={handleReturnHome}
        onCancel={handleReturnHome}
        footer={[
          <Button key="home" type="primary" onClick={handleReturnHome}>
            返回首页
          </Button>
        ]}
        centered
        closable={false}
        maskClosable={false}
      >
        <div className="text-center py-6">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-lg text-gray-700 mb-2">订单已成功创建！</p>
          <p className="text-gray-500">
            您可以在"我的订单"中查看订单状态
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            页面将在5秒后自动跳转...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;