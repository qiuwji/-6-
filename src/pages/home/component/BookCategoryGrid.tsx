import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  title: string;
  icon: string; // Font Awesome class
  onClick?: () => void;
}

const BookCategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number, isMore?: boolean) => {
    if (isMore) {
      navigate("/category");
    } else {
      navigate(`/category?categoryId=${categoryId}`);
    }
  };

  // 分类数组（为每个项添加onClick跳转逻辑）
  const categories: Category[] = [
    { 
      id: 1, 
      title: "文学", 
      icon: "fa-book", 
      onClick: () => handleCategoryClick(1) 
    },
    { 
      id: 2, 
      title: "历史", 
      icon: "fa-history", 
      onClick: () => handleCategoryClick(2) 
    },
    { 
      id: 3, 
      title: "科学", 
      icon: "fa-flask", 
      onClick: () => handleCategoryClick(3) 
    },
    { 
      id: 4, 
      title: "艺术", 
      icon: "fa-paint-brush", 
      onClick: () => handleCategoryClick(4) 
    },
    { 
      id: 5, 
      title: "商业", 
      icon: "fa-briefcase", 
      onClick: () => handleCategoryClick(5) 
    },
    { 
      id: 6, 
      title: "教育", 
      icon: "fa-graduation-cap", 
      onClick: () => handleCategoryClick(6) 
    },
    { 
      id: 7, 
      title: "更多分类", 
      icon: "fa-ellipsis-h", 
      onClick: () => handleCategoryClick(0, true) // 标记为更多分类
    },
  ];

  return (
    <section className="w-full">
      {/* 标题 */}
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        图书分类
      </h2>

      {/* 分类网格 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-7">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="
            flex flex-col items-center gap-3
            rounded-xl bg-gray-100/90 p-4 
            hover:shadow-md 
            hover:-translate-y-0.5
            transition-all duration-300 ease-in-out
            cursor-pointer
            "
            type="button" // 明确按钮类型，避免表单默认行为
          >
            {/* 图标圆 */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <i
                className={`fa ${item.icon} text-blue-500`}
                aria-hidden="true"
              />
            </div>

            {/* 文本 */}
            <span className="text-sm font-medium text-gray-900">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BookCategoryGrid;