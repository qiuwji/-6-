import React, { useState } from 'react'; 
import 'font-awesome/css/font-awesome.min.css';
import './BookCard.css';
import { useNavigate } from 'react-router-dom';

export interface BookCardProps {
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  price: number;
  discountPrice?: number;
  featureLabel?: string | null;
  points?: number;
  // 新增事件处理函数
  onCardClick?: (bookId: number) => void;
  onAddToCart?: (bookId: number, bookName: string) => Promise<void>;
}

const BookCard: React.FC<BookCardProps> = ({
  bookId,
  bookName,
  imageUrl,
  author,
  price,
  discountPrice,
  featureLabel,
  points,
  onCardClick,
  onAddToCart
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // 处理卡片点击
  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是购物车按钮，不触发卡片点击
    if ((e.target as HTMLElement).closest('.shopCart')) {
      return;
    }

    if (onCardClick) {
      onCardClick(bookId);
      return;
    }

    // 通过路由 state 传递当前卡片的基础信息，详情页可以优先使用这些数据快速渲染
    navigate(`/book/${bookId}`, {
      state: {
        book: {
          bookId,
          bookName,
          imageUrl,
          author,
          price,
          discountPrice,
          featureLabel,
          points,
        }
      }
    });
  };

  // 处理加入购物车按钮点击
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    setShowModal(true);
  };

  // 确认加入购物车
  const handleConfirmAddToCart = async () => {
    if (onAddToCart) {
      setIsLoading(true);
      try {
        await onAddToCart(bookId, bookName);
        setShowModal(false);
      } catch (error) {
        console.error('加入购物车失败:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // 如果没有提供处理函数，直接关闭模态框
      setShowModal(false);
    }
  };

  // 取消加入购物车
  const handleCancelAddToCart = () => {
    setShowModal(false);
  };

  // 点击模态框背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleCancelAddToCart();
    }
  };

  return (
    <>
      <div 
        className="BookCard cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        {featureLabel && (
          <div className="feature-tag-container">
            <span className="feature-tag">{featureLabel}</span>
          </div>
        )}
        
        <div className="book-img-container">
          <img 
            src={imageUrl}
            alt={bookName}
            loading='lazy'
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ts3.tc.mm.bing.net/th/id/OIP-C.oUYGYFTtQwQ8NJV1q8TkCgHaGI?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3';
            }}
          />
        </div>
        
        <h2 className='BookName hover:text-blue-600 transition-colors'>{bookName}</h2>
        <p className='AuthorName'>{author}</p>
        
        {points !== undefined && (
          <p className="BookPoints">
            <i className="fa fa-star" style={{ color: "#ffd700", marginRight: "4px" }}></i>
            评分：{points.toFixed(1)}
          </p>
        )}
        
        <div className="price-cart-wrap">
          <div>
            {discountPrice ? (
              <>
                <span className="Price discount-price">¥{discountPrice.toFixed(2)}</span>
                <span className="Price original-price">¥{price.toFixed(2)}</span>
              </>
            ) : (
              <span className="Price discount-price">¥{price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCartClick}
            className='shopCart hover:bg-blue-600 hover:text-white transition-colors'
            title="加入购物车"
          >
            <i className="fa fa-shopping-cart"></i>
          </button>
        </div>
      </div>

      {/* 加入购物车确认模态框 - 使用模糊背景 */}
      {showModal && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4 transition-all duration-300"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 md:scale-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()} // 阻止点击内容区域时关闭
          >
            <div className="p-6 md:p-8">
              {/* 模态框头部 */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <i className="fa fa-shopping-cart text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">加入购物车</h3>
                  <p className="text-gray-500 text-sm mt-1">确认将以下图书加入购物车</p>
                </div>
              </div>
              
              {/* 图书信息 */}
              <div className="flex items-start mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <img 
                  src={imageUrl} 
                  alt={bookName}
                  className="w-20 h-28 object-cover rounded shadow-md mr-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ts3.tc.mm.bing.net/th/id/OIP-C.oUYGYFTtQwQ8NJV1q8TkCgHaGI?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{bookName}</h4>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <i className="fa fa-user-pen mr-2 text-sm text-gray-400"></i>
                    {author}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {discountPrice ? (
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-red-500 mr-2">
                            ¥{discountPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ¥{price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-red-500">
                          ¥{price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {points !== undefined && (
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <i className="fa fa-star text-yellow-400 mr-1"></i>
                        <span className="font-medium text-gray-700">{points.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-4">
                <button
                  onClick={handleCancelAddToCart}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium flex items-center justify-center shadow-sm hover:shadow"
                >
                  <i className="fa fa-times mr-2"></i>
                  取消
                </button>
                <button
                  onClick={handleConfirmAddToCart}
                  disabled={isLoading}
                  className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      处理中...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check-circle mr-2"></i>
                      确认加入
                    </>
                  )}
                </button>
              </div>
              
              {/* 购物提示 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-500 text-sm">
                  <i className="fa fa-info-circle mr-2 text-blue-500"></i>
                  <span>加入购物车后，您可以在购物车页面统一结算</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;