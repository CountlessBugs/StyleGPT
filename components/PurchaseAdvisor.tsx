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

export default function PurchaseAdvisor() {
  const [style, setStyle] = useState('');
  const [plannedItems, setPlannedItems] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('四季通用');
  const [temperature, setTemperature] = useState('');
  const [budget, setBudget] = useState('');
  const [wardrobeList, setWardrobeList] = useState<WardrobeItemData[]>([]);
  const [advice, setAdvice] = useState('');
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
      if (event.detail && event.detail.items && event.detail.source === 'purchaseAdvisor') {
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
    .map(item => `${item.name}(颜色：${item.color}、材质：${item.material}、季节：${item.season})`)
    .join('、');

  const removeItem = (index: number) => {
    setWardrobeList(prev => prev.filter((_, i) => i !== index));
  };

  const clearWardrobe = () => {
    if (confirm('确定要清空所有选择的衣物吗？')) {
      setWardrobeList([]);
    }
  };

  const getAdvice = async () => {
    if (!style || !plannedItems) {
      alert('请填写穿搭风格和计划购买的衣物');
      return;
    }

    setLoading(true);
    setAdvice('');
    try {
      const response = await fetch('/api/purchase-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style,
          wardrobeItems: wardrobeDescription,
          plannedItems,
          season: selectedSeason,
          temperature,
          budget,
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
        setAdvice(result);
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        result += finalChunk;
        setAdvice(result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('获取建议失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        🛍️ 购买建议
      </h2>
      
      <div className="space-y-6">
        {wardrobeList.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <span className="font-semibold">📦 现有衣柜已加载：</span>
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {wardrobeList.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-xs bg-white dark:bg-blue-900/30 p-2 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-blue-700 dark:text-blue-300">{item.color} • {item.material} • {item.season}</p>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              💡 AI 会参考你的现有衣服来提供购买建议，确保新购买的衣服能更好地搭配。
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            喜爱的穿搭风格 *
          </label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="例如：复古、极简、运动休闲、甜美等"
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
            计划购买的衣物 *
          </label>
          <textarea
            value={plannedItems}
            onChange={(e) => setPlannedItems(e.target.value)}
            placeholder="请描述你计划购买的衣物类型和需求，例如：想买一件适合春秋的外套、寻找日常通勤的裤子等"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {wardrobeList.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 提示：将结合你现有的衣柜来提供搭配建议
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预算范围（可选）
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="例如：500-1000元、不限等"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={getAdvice}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '分析中...' : '🎯 获取购买建议'}
        </button>

        {advice && (
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              💡 AI购买建议：
            </h3>
            <MarkdownRenderer content={advice} />
          </div>
        )}
      </div>
    </div>
  );
}
