'use client';

import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface WardrobeItemData {
  name: string;
  category: string;
  color: string;
  material: string;
  season: string;
  description: string;
}

const SEASONS = ['春', '夏', '秋', '冬', '四季通用'];

export default function OutfitGenerator() {
  const [style, setStyle] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('四季通用');
  const [temperature, setTemperature] = useState('');
  const [occasion, setOccasion] = useState('');
  const [wardrobeList, setWardrobeList] = useState<WardrobeItemData[]>([]);
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  // 从 localStorage 加载衣柜数据
  useEffect(() => {
    const loadWardrobeFromStorage = () => {
      try {
        const savedWardrobe = localStorage.getItem('wardrobe');
        if (savedWardrobe) {
          const items = JSON.parse(savedWardrobe);
          setWardrobeList(
            items.map((item: any) => ({
              name: item.name,
              category: item.category,
              color: item.color,
              material: item.material,
              season: item.season,
              description: item.description
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load wardrobe:', error);
      }
    };

    loadWardrobeFromStorage();
  }, []);

  // 监听从衣柜导入的事件
  useEffect(() => {
    const handleImport = (event: CustomEvent) => {
      if (event.detail && event.detail.items && event.detail.source === 'wardrobe') {
        setWardrobeList(event.detail.items);
      }
    };

    window.addEventListener('importWardrobe', handleImport as EventListener);
    return () => {
      window.removeEventListener('importWardrobe', handleImport as EventListener);
    };
  }, []);

  // 根据季节筛选衣柜
  const filteredWardrobe = wardrobeList.filter(item => {
    if (selectedSeason === '四季通用') return true;
    return item.season === selectedSeason || item.season === '四季通用';
  });

  // 构建衣柜描述
  const wardrobeDescription = filteredWardrobe
    .map(item => `${item.name}(${item.color}、${item.material}、${item.season})—${item.description}`)
    .join('; ');

  const generateOutfit = async () => {
    if (!style || wardrobeList.length === 0) {
      alert('请填写穿搭风格并确保衣柜中有衣物');
      return;
    }

    setLoading(true);
    setSuggestions('');
    try {
      const response = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style,
          wardrobeItems: wardrobeDescription,
          season: selectedSeason,
          temperature,
          occasion
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应');
      }

      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        setSuggestions(result);
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        result += finalChunk;
        setSuggestions(result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('生成失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (index: number) => {
    setWardrobeList(prev => prev.filter((_, i) => i !== index));
  };

  const clearWardrobe = () => {
    if (confirm('确定要清空所有选择的衣物吗？')) {
      setWardrobeList([]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        📋 穿搭方案生成
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            穿搭风格 *
          </label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="例如：韩系、日系、欧美街头、简约通勤等"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              季节
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              气温(可选)
            </label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="例如：温暖、凉爽、炎热、寒冷等"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            已有服装 (共 {filteredWardrobe.length} 项)
          </label>
          {wardrobeList.length === 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
              💡 从&quot;我的衣柜&quot;导入衣物
            </div>
          ) : (
            <div className="space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                {filteredWardrobe.map((item, index) => {
                  const originalIndex = wardrobeList.indexOf(item);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-start bg-white dark:bg-gray-800 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.color} • {item.material} • {item.season}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(originalIndex)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 p-1 flex-shrink-0"
                        title="删除"
                      >
                        ❌
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearWardrobe}
                  className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all"
                >
                  🗑️ 清空所有
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            穿搭场合（可选）
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="例如：约会、上班、逛街、聚会等"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={generateOutfit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '生成中...' : '✨ 生成穿搭方案'}
        </button>

        {suggestions && (
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              💡 AI推荐的穿搭方案：
            </h3>
            <MarkdownRenderer content={suggestions} />
          </div>
        )}
      </div>
    </div>
  );
}
