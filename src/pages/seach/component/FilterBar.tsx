import React, { useState } from "react";
import type { CategoryItem } from "../SearchResultPage";

interface FilterBarProps {
  categoryItems: CategoryItem[];
  selectedCategories?: string[];  // 改为数组类型
  priceRange?: number[];
  star?: number;

  onApply?: (params: {
    categories: string[];  // 改为数组类型
    priceRange: number[];
    star: number;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categoryItems,
  selectedCategories = [],  // 默认值为空数组
  priceRange = [],
  star = 0,
  onApply,
}) => {
  /** ===== 本地状态 ===== */
  const [categories, setCategories] = useState<string[]>(selectedCategories);
  const [minPrice, setMinPrice] = useState<number>(priceRange[0] ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(priceRange[1] ?? 0);
  const [rating, setRating] = useState<number>(star);

  /** ===== 分类：多选 ===== */
  const handleCategoryChange = (value: string) => {
    setCategories(prev => {
      if (prev.includes(value)) {
        // 如果已选中，则移除
        return prev.filter(cat => cat !== value);
      } else {
        // 如果未选中，则添加
        return [...prev, value];
      }
    });
  };

  /** ===== 应用 ===== */
  const handleApply = () => {
    onApply?.({
      categories,  // 传递数组
      priceRange: [minPrice, maxPrice],
      star: rating,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ================= 分类 ================= */}
      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-bold">分类</h2>
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setCategories([])}  // 清空数组
          >
            清除
          </span>
        </div>

        {categoryItems.map(item => (
          <div
            key={item.category}
            className="flex items-center justify-between py-1"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={categories.includes(item.category)}  // 检查是否在数组中
                onChange={() => handleCategoryChange(item.category)}
              />
              <span>{item.category}</span>
            </label>
            <span className="text-gray-400 text-sm">
              ({item.count})
            </span>
          </div>
        ))}
      </div>

      {/* ================= 价格范围 ================= */}
      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-bold">价格范围</h2>
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setMinPrice(0);
              setMaxPrice(0);
            }}
          >
            清除
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="最低"
            value={minPrice === 0 ? "" : minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="最高"
            value={maxPrice === 0 ? "" : maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* ================= 评分 ================= */}
      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-bold">评分</h2>
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setRating(0)}
          >
            清除
          </span>
        </div>

        {[5, 4, 3, 2].map(value => (
          <label
            key={value}
            className="flex items-center gap-2 py-1 cursor-pointer"
          >
            <input
              type="radio"
              checked={rating === value}
              onChange={() => setRating(value)}
            />
            <span>
              {"⭐".repeat(value)}
              {"☆".repeat(5 - value)} 及以上
            </span>
          </label>
        ))}
      </div>

      {/* ================= 应用按钮（单独一块） ================= */}
      <button
        onClick={handleApply}
        className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ml-4 mr-4"
      >
        应用
      </button>
    </div>
  );
};

export default FilterBar;