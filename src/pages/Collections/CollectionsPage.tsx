import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 定义收藏项接口
interface CollectionItem {
  id: number;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  collectTime: string;
}

const CollectionsPage = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: 1,
      title: "《React设计模式与最佳实践》",
      author: "薛定谔的猫",
      isbn: "9787115591207",
      coverImage: "https://picsum.photos/120/180?random=1",
      collectTime: "2025-10-01 14:30:00"
    },
    {
      id: 2,
      title: "《Tailwind CSS实战指南》",
      author: "前端小能手",
      isbn: "9787121445678",
      coverImage: "https://picsum.photos/120/180?random=2",
      collectTime: "2025-10-05 09:15:00"
    },
    {
      id: 3,
      title: "《JavaScript高级程序设计（第4版）》",
      author: "尼古拉斯·泽卡斯",
      isbn: "9787115549655",
      coverImage: "https://picsum.photos/120/180?random=3",
      collectTime: "2025-10-10 16:40:00"
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 取消收藏
  const handleCancelCollection = (id: number) => {
    // 在实际应用中，这里应该调用API接口取消收藏
    setCollections(prev => prev.filter(item => item.id !== id));
    
    // 可以添加确认对话框
    // if (window.confirm('确定要取消收藏吗？')) {
    //   setCollections(prev => prev.filter(item => item.id !== id));
    // }
  };

  // 批量取消收藏（如果有批量操作需求）
  const handleBatchCancel = (ids: number[]) => {
    setCollections(prev => prev.filter(item => !ids.includes(item.id)));
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
                key={item.id} 
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
                    <Link to={`/book/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="text-gray-500 mt-1">
                    <i className="fa fa-user-pen mr-2 text-sm"></i>
                    作者：{item.author}
                  </p>
                  <p className="text-gray-500 mt-1">
                    <i className="fa fa-barcode mr-2 text-sm"></i>
                    ISBN：{item.isbn}
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
                    to={`/book/${item.id}`}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                  >
                    <i className="fa fa-eye mr-2"></i>查看详情
                  </Link>
                  
                  {/* 取消收藏按钮 */}
                  <button 
                    onClick={() => handleCancelCollection(item.id)}
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
                  const ids = collections.map(item => item.id);
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