import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections, removeCollection } from '@/services/collectionService';

// 定义收藏项接口（与后端返回字段映射）
interface CollectionItem {
  id: number; // collection id
  bookId: number;
  title: string;
  author: string;
  coverImage: string;
  collectTime: string;
}

const CollectionsPage = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getCollections(1, 100);
      if (res) {
        const mapped = res.list.map(item => ({
          id: item.id,
          bookId: item.bookId,
          title: item.bookName,
          author: item.author,
          coverImage: item.imageUrl ?? '',
          collectTime: item.collectTime
        }));
        setCollections(mapped);
      } else {
        setCollections([]);
      }
    } catch (err) {
      console.error('加载收藏失败:', err);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 取消收藏
  const handleCancelCollection = async (bookId: number) => {
    if (!window.confirm('确定要取消收藏这本书吗？')) return;
    try {
      const ok = await removeCollection(bookId);
      if (ok) {
        setCollections(prev => prev.filter(item => item.bookId !== bookId));
      }
    } catch (err) {
      console.error('取消收藏失败:', err);
      alert('取消收藏失败');
    }
  };

  // 批量取消收藏（如果有批量操作需求）
  const handleBatchCancel = async (ids: number[]) => {
    if (!window.confirm('确定要清空全部收藏吗？')) return;
    try {
      // 逐个删除
      await Promise.all(ids.map(id => removeCollection(id)));
      setCollections([]);
    } catch (err) {
      console.error('清空收藏失败:', err);
      alert('清空收藏失败');
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 页面主体 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">我的收藏</h1>
          <p className="text-gray-500 mt-2">这里展示你收藏的所有图书，可随时取消收藏</p>
          {collections.length > 0 && (
            <p className="text-blue-600 mt-1">
              共 <span className="font-bold">{collections.length}</span> 本收藏图书
            </p>
          )}
        </div>

        {/* 收藏列表（有数据状态） */}
        {collections.length > 0 ? (
          <div className="collection-list space-y-4">
            {collections.map((item) => (
              <div 
                key={item.bookId} 
                className="bg-white rounded-lg shadow-sm p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 hover:shadow-md transition-shadow"
              >
                {/* 图书封面 */}
                <img 
                  src={item.coverImage} 
                  alt={item.title} 
                  className="w-24 h-36 object-cover rounded shadow"
                  onError={(e) => {
                    // 图片加载失败时使用默认图片
                    e.currentTarget.src = 'https://via.placeholder.com/120x180?text=Book+Cover';
                  }}
                />
                
                {/* 图书信息 */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                    <Link to={`/book/${item.bookId}`}>{item.title}</Link>
                  </h3>
                  <p className="text-gray-500 mt-1">
                    <i className="fa fa-user-pen mr-2 text-sm"></i>
                    作者：{item.author}
                  </p>
                  <p className="text-gray-400 mt-1 text-sm">
                    <i className="fa fa-clock mr-2"></i>
                    收藏时间：{item.collectTime}
                  </p>
                </div>
                
                {/* 操作按钮区域 */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* 查看详情按钮 */}
                  <Link 
                    to={`/book/${item.bookId}`}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                  >
                    <i className="fa fa-eye mr-2"></i>查看详情
                  </Link>
                  
                  {/* 取消收藏按钮 */}
                  <button 
                    onClick={() => handleCancelCollection(item.bookId)}
                    className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                  >
                    <i className="fa fa-heart-crack mr-2"></i>取消收藏
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 空收藏状态 */
          <div className="empty-collection flex flex-col items-center justify-center py-16 text-center">
            <i className="fa fa-heart-o text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无收藏图书</h2>
            <p className="text-gray-500 mb-6">快去首页收藏你喜欢的图书吧～</p>
            <Link 
              to="/" 
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center"
            >
              <i className="fa fa-home mr-2"></i> 返回首页
            </Link>
          </div>
        )}

        {/* 批量操作区域（如果有多个收藏） */}
        {collections.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                <i className="fa fa-info-circle mr-2 text-blue-500"></i>
                提示：取消收藏后，图书将从列表中移除
              </div>
              <button 
                onClick={() => {
                  const ids = collections.map(item => item.bookId);
                  if (window.confirm(`确定要清空全部 ${collections.length} 本收藏图书吗？`)) {
                    handleBatchCancel(ids);
                  }
                }}
                className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-600 px-6 py-2 rounded-md transition-colors flex items-center"
              >
                <i className="fa fa-trash-can mr-2"></i>清空全部收藏
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionsPage;