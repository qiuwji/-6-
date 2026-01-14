import React, { useEffect, useState } from 'react';
import BookOverview from './component/BookOverview';
import BookDetailTabs from './component/BookDetailTabs';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 

// 直接定义BookDetail类型，避免依赖问题
interface BookDetail {
  id: number;
  bookName: string;
  book_cover: string;
  author: string;
  publisher: string;
  ISBN: string;
  price: number;
  discount_rate: number;
  comment_count: number;
  total_score: number;
  stock: number;
  publish_time: string;
  category: string;
  isFavorited: boolean;
}

interface BookDetailPageProps {
  bookId?: number;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId }) => {
  const params = useParams<{ bookId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 获取实际的图书ID
  const actualBookId = bookId || (params?.bookId ? parseInt(params.bookId, 10) : null);
  
  console.log('🔍 实际图书ID:', actualBookId);
  console.log('🔍 路由参数:', params);

  // 状态管理
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 直接调用API的函数
  const fetchBookDetailDirectly = async () => {
    if (!actualBookId || isNaN(actualBookId)) {
      setError('无效的图书ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🚀 开始直接请求API: /books/${actualBookId}`);
      
      // 🔥 方法1：直接使用fetch API（最可靠）
      const baseURL = 'http://localhost:8080'; // 改成你的后端地址
      const response = await fetch(`${baseURL}/books/${actualBookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API返回原始数据:', data);
      
      // 🔥 方法2：使用axios（备选）
      // const response = await axios.get(`/api/books/${actualBookId}`);
      // const data = response.data;
      
      if (data) {
        // 映射数据到组件需要的格式
        const mappedData: BookDetail = {
          id: data.id || data.bookId || actualBookId,
          bookName: data.bookName || data.title || data.name || `图书 ${actualBookId}`,
          book_cover: data.book_cover || data.cover || data.imageUrl || 'https://via.placeholder.com/300x400',
          author: data.author || data.book_author || '未知作者',
          publisher: data.publisher || data.book_publisher || '未知出版社',
          ISBN: data.ISBN || data.isbn || '未知',
          price: data.price || data.book_price || 0,
          discount_rate: data.discount_rate || data.discount || 0,
          comment_count: data.comment_count || data.comments_count || 0,
          total_score: data.total_score || data.score_total || data.points || 0,
          stock: data.stock || data.inventory || 0,
          publish_time: data.publish_time || data.published_at || '',
          category: data.category || data.category_name || '',
          isFavorited: data.isFavorited || data.is_favorited || false,
        };
        
        setBookData(mappedData);
        console.log('✅ 映射后的数据:', mappedData);
      } else {
        throw new Error('API返回数据为空');
      }
    } catch (err: any) {
      console.error('❌ API请求失败:', err);
      setError(err.message || '获取图书详情失败');
      
      // 🔥 紧急备用：如果API失败，使用模拟数据确保页面显示
      const mockData: BookDetail = {
        id: actualBookId || 1,
        bookName: `测试图书 ${actualBookId}`,
        book_cover: 'https://via.placeholder.com/300x400',
        author: '测试作者',
        publisher: '测试出版社',
        ISBN: '978-7-123-45678-9',
        price: 59.8,
        discount_rate: 0.85,
        comment_count: 128,
        total_score: 4.5,
        stock: 50,
        publish_time: '2023-10-01',
        category: '计算机科学',
        isFavorited: false,
      };
      setBookData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 主效果：调用API
  useEffect(() => {
    console.log('🔄 useEffect执行，准备获取图书详情');
    
    // 立即执行API请求
    fetchBookDetailDirectly();
    
    // 调试：检查网络请求
    const checkRequest = () => {
      console.log('📡 检查是否发起了网络请求...');
      // 在Chrome开发者工具中查看Network标签
    };
    
    setTimeout(checkRequest, 100);
  }, [actualBookId]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">正在加载图书详情...</p>
              <p className="text-sm text-gray-500 mt-2">图书ID: {actualBookId}</p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态（但仍然显示数据，确保页面不空白）
  if (error && !bookData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">加载失败</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={fetchBookDetailDirectly}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  重新加载
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 关键：确保即使有错误，只要有数据就显示
  if (!bookData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl text-yellow-500 mb-4">📚</div>
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">未找到图书</h3>
              <p className="text-yellow-600 mb-4">图书ID: {actualBookId} 不存在</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 正常渲染 - 保持样式完全不变！！！
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 space-y-6">
        {/* 显示调试信息（开发时使用） */}
        {error && (
          <div className="container mx-auto px-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
              <p className="text-yellow-700">⚠️ 注意：{error}，但已显示备用数据</p>
            </div>
          </div>
        )}
        
        {/* BookOverview组件 - 传递所有需要的props */}
        <BookOverview
          bookName={bookData.bookName}
          book_cover={bookData.book_cover}
          author={bookData.author}
          publisher={bookData.publisher}
          ISBN={bookData.ISBN}
          price={bookData.price}
          discount_rate={bookData.discount_rate}
          comment_count={bookData.comment_count}
          total_score={bookData.total_score}
          stock={bookData.stock}
          publish_time={bookData.publish_time}
          category={bookData.category}
          isFavorited={bookData.isFavorited}
          bookId={bookData.id}
        />

        {/* BookDetailTabs组件 */}
        <BookDetailTabs bookId={bookData.id} />
      </div>
    </div>
  );
};

export default BookDetailPage;