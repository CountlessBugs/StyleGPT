'use client';

import { useState, useEffect } from 'react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  season: string;
  description: string;
  createdAt: string;
}

const CATEGORIES = [
  '上衣',
  '裤装',
  '裙装',
  '外套',
  '鞋履',
  '配饰',
  '其他'
];

const SEASONS = ['春', '夏', '秋', '冬', '四季通用'];
const MATERIALS = ['棉', '麻', '丝', '毛', '皮革', '牛仔', '针织', '其他'];

export default function Wardrobe() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [filterColor, setFilterColor] = useState<string>('');
  const [filterSeason, setFilterSeason] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  // 新增衣物表单
  const [newItem, setNewItem] = useState({
    name: '',
    category: '上衣',
    color: '',
    material: '棉',
    season: '四季通用',
    description: ''
  });

  // 从 localStorage 加载衣柜数据
  useEffect(() => {
    const savedWardrobe = localStorage.getItem('wardrobe');
    if (savedWardrobe) {
      try {
        setWardrobe(JSON.parse(savedWardrobe));
      } catch (error) {
        console.error('Failed to load wardrobe:', error);
      }
    }
  }, []);

  // 保存衣柜数据到 localStorage
  const saveWardrobe = (items: ClothingItem[]) => {
    localStorage.setItem('wardrobe', JSON.stringify(items));
    setWardrobe(items);
  };

  // 添加衣物
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      alert('请填写衣物名称');
      return;
    }

    const item: ClothingItem = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString()
    };

    const updatedWardrobe = [...wardrobe, item];
    saveWardrobe(updatedWardrobe);

    // 重置表单
    setNewItem({
      name: '',
      category: '上衣',
      color: '',
      material: '棉',
      season: '四季通用',
      description: ''
    });
    setIsAddingItem(false);
  };

  // 删除衣物
  const handleDeleteItem = (id: string) => {
    if (confirm('确定要删除这件衣物吗？')) {
      const updatedWardrobe = wardrobe.filter(item => item.id !== id);
      saveWardrobe(updatedWardrobe);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // 导入到穿搭方案
  const handleExportToOutfit = () => {
    if (selectedItems.size === 0) {
      alert('请至少选择一件衣物');
      return;
    }

    const itemsData = Array.from(selectedItems)
      .map(id => filteredItems.find(item => item.id === id))
      .filter(Boolean)
      .map(item => ({
        name: item!.name,
        category: item!.category,
        color: item!.color,
        material: item!.material,
        season: item!.season,
        description: item!.description
      }));
    
    window.dispatchEvent(new CustomEvent('importWardrobe', { 
      detail: { items: itemsData, source: 'wardrobe' }
    }));
    
    setSelectedItems(new Set());
    alert(`已导入 ${itemsData.length} 件衣物到穿搭方案！请切换到"穿搭方案"标签查看。`);
  };

  // 导入到购买建议
  const handleExportToPurchaseAdvisor = () => {
    if (selectedItems.size === 0) {
      alert('请至少选择一件衣物');
      return;
    }

    const itemsData = Array.from(selectedItems)
      .map(id => filteredItems.find(item => item.id === id))
      .filter(Boolean)
      .map(item => ({
        name: item!.name,
        category: item!.category,
        color: item!.color,
        material: item!.material,
        season: item!.season,
        description: item!.description
      }));
    
    window.dispatchEvent(new CustomEvent('importWardrobe', { 
      detail: { items: itemsData, source: 'purchaseAdvisor' }
    }));
    
    setSelectedItems(new Set());
    alert(`已导入 ${itemsData.length} 件衣物到购买建议！请切换到"购买建议"标签查看。`);
  };

  // 切换选中状态
  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  // 筛选衣物
  const filteredItems = wardrobe.filter(item => {
    const matchesCategory = filterCategory === '全部' || item.category === filterCategory;
    const matchesColor = !filterColor || item.color.toLowerCase().includes(filterColor.toLowerCase());
    const matchesSeason = filterSeason === '全部' || item.season === filterSeason;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesColor && matchesSeason && matchesSearch;
  });

  // 获取所有颜色列表
  const allColors = Array.from(new Set(wardrobe.map(item => item.color).filter(Boolean)));

  // 统计信息
  const categoryStats = CATEGORIES.reduce((acc, category) => {
    acc[category] = wardrobe.filter(item => item.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            👔 我的衣柜
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            共 {wardrobe.length} 件衣物，已选择 {selectedItems.size} 件
          </p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          ➕ 添加衣物
        </button>
      </div>

      {/* 添加衣物对话框 */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              添加新衣物
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  衣物名称 *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="例如：白色T恤"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类 *
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  颜色
                </label>
                <input
                  type="text"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  placeholder="例如：白色、黑色"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  材质 *
                </label>
                <select
                  value={newItem.material}
                  onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {MATERIALS.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  季节 *
                </label>
                <select
                  value={newItem.season}
                  onChange={(e) => setNewItem({ ...newItem, season: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {SEASONS.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  描述（可选）
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="例如：纯棉材质，宽松版型，适合休闲"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddingItem(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleAddItem}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 基础筛选 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('全部')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === '全部'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部 ({wardrobe.length})
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category} ({categoryStats[category] || 0})
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 搜索衣物名称、颜色或描述..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* 高级筛选 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <button
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {showAdvancedFilter ? '▼' : '▶'} 高级筛选
        </button>

        {showAdvancedFilter && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* 颜色筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                颜色
              </label>
              <input
                type="text"
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                placeholder="输入颜色名称..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
              {allColors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {allColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setFilterColor(color)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        filterColor === color
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                  {filterColor && (
                    <button
                      onClick={() => setFilterColor('')}
                      className="px-2 py-1 text-xs rounded bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-800"
                    >
                      清除
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 季节筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                季节
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterSeason('全部')}
                  className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                    filterSeason === '全部'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  全部
                </button>
                {SEASONS.map(season => (
                  <button
                    key={season}
                    onClick={() => setFilterSeason(season)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                      filterSeason === season
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      {filteredItems.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              已选择 {selectedItems.size} / {filteredItems.length} 件衣物
            </div>
            <button
              onClick={toggleSelectAll}
              className="text-sm px-3 py-1 rounded bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700"
            >
              {selectedItems.size === filteredItems.length && filteredItems.length > 0 ? '取消全选' : '全选'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportToOutfit}
              disabled={selectedItems.size === 0}
              className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📋 导入到穿搭方案
            </button>
            <button
              onClick={handleExportToPurchaseAdvisor}
              disabled={selectedItems.size === 0}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛍️ 导入到购买建议
            </button>
          </div>
        </div>
      )}

      {/* 衣物列表 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👗</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {wardrobe.length === 0 
              ? '衣柜空空如也，快添加你的第一件衣物吧！'
              : '没有找到匹配的衣物'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItemSelection(item.id)}
              className={`relative rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedItems.has(item.id)
                  ? 'bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-500 shadow-lg'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border-2 border-transparent'
              }`}
            >
              {/* 选中勾选 */}
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="w-5 h-5 rounded border-2 border-gray-400 flex items-center justify-center bg-white dark:bg-gray-800">
                  {selectedItems.has(item.id) && (
                    <span className="text-purple-500 font-bold">✓</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                  title="删除"
                >
                  🗑️
                </button>
              </div>

              <div className="pr-16">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                  {item.name}
                </h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {item.color && (
                    <span className="text-xs bg-pink-200 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded">
                      {item.color}
                    </span>
                  )}
                  {item.material && (
                    <span className="text-xs bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      {item.material}
                    </span>
                  )}
                  {item.season && (
                    <span className="text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {item.season}
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                添加于 {new Date(item.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
