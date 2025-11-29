'use client';

import { useState } from 'react';
import OutfitGenerator from '@/components/OutfitGenerator';
import PurchaseAdvisor from '@/components/PurchaseAdvisor';
import VirtualTryOn from '@/components/VirtualTryOn';
import Wardrobe from '@/components/Wardrobe';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'generate' | 'purchase' | 'tryon'>('wardrobe');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            穿搭GPT
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            AI智能穿搭助手 - 让每一天都穿出你的风格
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 inline-flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'wardrobe'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              👔 我的衣柜
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📋 穿搭方案
            </button>
            <button
              onClick={() => setActiveTab('purchase')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'purchase'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🛍️ 购买建议
            </button>
            <button
              onClick={() => setActiveTab('tryon')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'tryon'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              👗 虚拟试穿
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'wardrobe' && <Wardrobe />}
          {activeTab === 'generate' && <OutfitGenerator />}
          {activeTab === 'purchase' && <PurchaseAdvisor />}
          {activeTab === 'tryon' && <VirtualTryOn />}
        </div>
      </div>
    </main>
  );
}
