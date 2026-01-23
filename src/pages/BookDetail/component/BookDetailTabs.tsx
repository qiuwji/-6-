import { useState, useEffect } from 'react';

// 定义标签类型
type TabType = 'details' | 'reviews';

// 用户评价
interface Review {
  id: number;
  userName: string;
  avatar: string;
  rating: number;
  commentTime: string;
  content: string;
  images?: string[];
  buyTime: string;
  like: number;
}

interface RatingDistribution {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

interface BookDetailSection {
  title: string;      
  content: string;   
}

// 定义组件props接口
interface BookDetailTabsProps {
  bookId: string | number;
}

const smartParseBookDetail = (content: string): BookDetailSection[] => {
  const sections: BookDetailSection[] = [];
  
  // 移除首尾空白
  const trimmedContent = content.trim();
  
  // 尝试按不同的分隔符分割
  if (trimmedContent.includes('\n\n')) {
    // 格式：小标题\n内容\n\n小标题2\n内容2
    const blocks = trimmedContent.split('\n\n');
    
    blocks.forEach(block => {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      if (lines.length >= 2) {
        sections.push({
          title: lines[0].trim(),
          content: lines.slice(1).join('\n').trim(),
        });
      }
    });
  } else if (trimmedContent.includes('：')) {
    // 格式：小标题：内容\n小标题2：内容2
    const lines = trimmedContent.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach(line => {
      const parts = line.split('：');
      if (parts.length >= 2) {
        sections.push({
          title: parts[0].trim(),
          content: parts.slice(1).join('：').trim(),
        });
      }
    });
  }
  
  return sections;
};

const BookDetailTabs = ({ bookId }: BookDetailTabsProps) => {
  const [bookDetails, setBookDetails] = useState<BookDetailSection[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [commentCount, setCommentCount] = useState<number>(0);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution>({
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 使用传入的bookId调用API
        // 1. 获取图书详情
        // const bookDetailResponse = await fetch(`/api/book/${bookId}/details`);
        // const bookDetailData = await bookDetailResponse.json();
        // const parsedDetails = smartParseBookDetail(bookDetailData.content);
        // setBookDetails(parsedDetails);
        
        // 2. 获取评论统计
        // const commentStatsResponse = await fetch(`/api/book/${bookId}/comments/stats`);
        // const commentStatsData = await commentStatsResponse.json();
        // setCommentCount(commentStatsData.totalComments);
        // setRatingDistribution(commentStatsData.ratingDistribution);
        
        // 3. 获取评论列表
        // const reviewsResponse = await fetch(`/api/book/${bookId}/comments?page=1&limit=10`);
        // const reviewsData = await reviewsResponse.json();
        // setReviews(reviewsData.comments);
        setBookDetails([]);
        setCommentCount(0);
        setRatingDistribution({
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        });
        setReviews([]);
        
      } catch (error) {
        console.error('获取数据失败:', error);
        // TODO: 添加错误处理，如显示错误提示
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]); // 添加bookId作为依赖项

  // 渲染星星评分
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fa fa-star text-yellow-400"></i>);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<i key={i} className="fa fa-star-half-o text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="fa fa-star-o text-gray-300"></i>);
      }
    }
    return stars;
  };

  // 显示图书详情
  const showBookDetail = () => (
    <div className="prose max-w-none">
      {bookDetails.length > 0 ? (
        bookDetails.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <div className="text-gray-700">
              {section.content.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无图书详情信息</p>
        </div>
      )}
    </div>
  );

  // 显示用户评价
  const showComments = () => (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* 总体评分区域 */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 左侧评分统计 */}
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {commentCount > 0 ? '4.5' : '0.0'}
                  </div>
                  <div className="flex mb-2">
                    {commentCount > 0 ? (
                      <>
                        <i className="fa fa-star text-yellow-400 text-xl"></i>
                        <i className="fa fa-star text-yellow-400 text-xl"></i>
                        <i className="fa fa-star text-yellow-400 text-xl"></i>
                        <i className="fa fa-star text-yellow-400 text-xl"></i>
                        <i className="fa fa-star-half-o text-yellow-400 text-xl"></i>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-star-o text-gray-300 text-xl"></i>
                        <i className="fa fa-star-o text-gray-300 text-xl"></i>
                        <i className="fa fa-star-o text-gray-300 text-xl"></i>
                        <i className="fa fa-star-o text-gray-300 text-xl"></i>
                        <i className="fa fa-star-o text-gray-300 text-xl"></i>
                      </>
                    )}
                  </div>
                  <div className="text-gray-500 mb-6">基于 {commentCount.toLocaleString()} 条评价</div>

                  {/* 评分分布条 */}
                  {commentCount > 0 ? (
                    <div className="w-full space-y-3">
                      {[
                        { label: '5星', percent: ratingDistribution.fiveStar },
                        { label: '4星', percent: ratingDistribution.fourStar },
                        { label: '3星', percent: ratingDistribution.threeStar },
                        { label: '2星', percent: ratingDistribution.twoStar },
                        { label: '1星', percent: ratingDistribution.oneStar },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-10 text-sm text-gray-600">{item.label}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3 overflow-hidden">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-sm text-gray-600 text-right">{item.percent}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">暂无评分数据</p>
                  )}
                </div>
              </div>

              {/* 右侧筛选和写评价 */}
              <div className="md:w-2/3">
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    全部评价
                  </button>
                  <button className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                    最新
                  </button>
                  <button className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                    有图 (0)
                  </button>
                  <button className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                    好评 (0)
                  </button>
                  <button className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                    中评 (0)
                  </button>
                  <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                    差评 (0)
                  </button>
                </div>

                <button className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <i className="fa fa-pencil mr-2"></i>
                  写评价
                </button>
              </div>
            </div>
          </div>

          {/* 评价列表 */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        <img
                          src={review.avatar}
                          alt={review.userName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">{review.commentTime}</div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.content}</p>

                  {/* 用户上传的图片 */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded overflow-hidden">
                          <img
                            src={img}
                            alt={`用户上传 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">购买日期：{review.buyTime}</span>
                    <div className="flex items-center ml-auto space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <i className="fa fa-thumbs-up mr-1"></i>
                        有用 ({review.like})
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <i className="fa fa-comment-o mr-1"></i>
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无评价</p>
                <button className="cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  发表第一条评价
                </button>
              </div>
            )}
          </div>

          {/* 分页 - 只在有评论时显示 */}
          {reviews.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button className="py-2 px-4 bg-white border border-gray-300 rounded-l-md text-gray-500 hover:bg-gray-50">
                  <i className="fa fa-angle-left"></i>
                </button>
                <button className="py-2 px-4 bg-blue-600 text-white border border-blue-600">1</button>
                <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="py-2 px-4 bg-white border border-gray-300 text-gray-700">...</span>
                <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  24
                </button>
                <button className="py-2 px-4 bg-white border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50">
                  <i className="fa fa-angle-right"></i>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );

  // 标签页按钮
  const tabs = [
    { id: 'details' as TabType, label: '图书详情' },
    { id: 'reviews' as TabType, label: `用户评价 (${commentCount.toLocaleString()})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg">
        {/* 标签页标题栏 */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">
                <i className="fa fa-spinner fa-spin"></i>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'details' && showBookDetail()}
              {activeTab === 'reviews' && showComments()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailTabs;