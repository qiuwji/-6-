import type React from "react";

const filters = ['全部', '书名', '作者', 'ISBN'];
const sortOptions = ['相关度', '销量从高到低', '销量从低到高', '价格从高到低', '价格从低到高'];

interface TabBarProps {
  // 当前选中的状态（从父组件传入）
  selectedFilter: string;
  selectedSort: string;
  // 事件回调（通知父组件状态变化）
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  selectedFilter = '全部',
  selectedSort = '相关度',
  onFilterChange,
  onSortChange
}) => {
  // 处理筛选按钮点击
  const handleFilterClick = (filterText: string) => {
    if (onFilterChange && selectedFilter !== filterText) {
      onFilterChange(filterText);
    }
  };

  // 处理排序选择变化
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSortChange) {
      onSortChange(event.target.value);
    }
  };

  // 渲染排序下拉框选项
  const renderSortOptions = () => {
    return sortOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-4 bg-white">
      <div className="w-full shadow-sm rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* 筛选按钮组 */}
        <div className="flex flex-row flex-wrap gap-2">
          {filters.map((filterText) => (
            <button
              key={filterText}
              onClick={() => handleFilterClick(filterText)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
                selectedFilter === filterText
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterText}
            </button>
          ))}
        </div>

        {/* 排序下拉框 */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            排序方式：
          </label>
          <div className="relative">
            <select
              id="sortBy"
              name="sortBy"
              value={selectedSort}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              {renderSortOptions()}
            </select>
            {/* 下拉箭头 */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 当前状态显示 */}
      <div className="mt-2 text-sm text-gray-500 flex items-center">
        <span className="mr-4">
          当前筛选: <span className="font-medium text-blue-600">{selectedFilter}</span>
        </span>
        <span>
          当前排序: <span className="font-medium text-blue-600">{selectedSort}</span>
        </span>
      </div>
    </div>
  );
};

export default TabBar;