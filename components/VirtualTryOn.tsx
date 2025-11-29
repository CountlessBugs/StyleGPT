'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProgressUpdate {
  progress?: number;
  status?: string;
}

export default function VirtualTryOn() {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string>('');
  const [outfitDescription, setOutfitDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [isContentViolation, setIsContentViolation] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!userImage || !outfitDescription) {
      setError('请上传照片并描述服装');
      return;
    }

    setError('');
    setProgress(0);
    setProgressStatus('');
    setIsContentViolation(false);
    setLoading(true);
    
    // 模拟进度条加速
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          const increment = Math.random() * (15 - 5) + 5; // 5-15% 递增
          return Math.min(Math.floor(prev + increment), 90); // 去掉小数
        }
        return prev;
      });
    }, 800);
    
    try {
      const formData = new FormData();
      formData.append('image', userImage);
      formData.append('outfit', outfitDescription);

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      // 清除进度条计时器
      clearInterval(progressInterval);
      
      if (!response.ok) {
        setProgress(0);
        setProgressStatus('');
        // 检查是否是内容违规错误
        if (data.possibleContentViolation) {
          setIsContentViolation(true);
          setError(data.suggestion || 'API 错误：' + (data.error || '未知错误'));
        } else {
          setError(`API 错误：${data.error || '未知错误'}`);
        }
        if (data.details) {
          console.error('API 错误详情:', data.details);
        }
        return;
      }
      
      if (data.imageUrl) {
        setProgress(100);
        setProgressStatus('完成！');
        setTimeout(() => {
          setGeneratedImage(data.imageUrl);
          setError('');
        }, 300);
      } else {
        setProgress(0);
        setProgressStatus('');
        setError('生成失败，未获得图像数据');
        console.error('API 响应:', data);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setProgressStatus('');
      console.error('Error:', error);
      setError(`网络错误：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        👔 虚拟试穿
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            上传你的照片 *
          </label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100
                dark:file:bg-gray-700 dark:file:text-purple-400"
            />
          </div>
          {userImagePreview && (
            <div className="mt-4">
              <img
                src={userImagePreview}
                alt="Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            描述想试穿的服装 *
          </label>
          <textarea
            value={outfitDescription}
            onChange={(e) => setOutfitDescription(e.target.value)}
            placeholder="详细描述想试穿的服装，例如：黑色西装外套搭配白色衬衫和深蓝色牛仔裤"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={generateTryOn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '生成中...' : '🎨 生成试穿效果'}
        </button>

        {loading && progress > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-700 dark:text-blue-400 font-medium">⏳ 生成进度</p>
              <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            {progressStatus && (
              <p className="text-blue-600 dark:text-blue-300 text-sm mt-2">{progressStatus}</p>
            )}
          </div>
        )}

        {error && (
          <div className={`mt-6 p-4 rounded-lg border ${
            isContentViolation 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`font-medium ${
              isContentViolation
                ? 'text-yellow-700 dark:text-yellow-400'
                : 'text-red-700 dark:text-red-400'
            }`}>
              {isContentViolation ? '⚠️ 内容审核提示' : '⚠️'} {error}
            </p>
            <p className={`text-sm mt-2 ${
              isContentViolation
                ? 'text-yellow-600 dark:text-yellow-500'
                : 'text-red-600 dark:text-red-500'
            }`}>
              请检查：
            </p>
            <ul className={`text-sm mt-1 ml-4 list-disc ${
              isContentViolation
                ? 'text-yellow-600 dark:text-yellow-500'
                : 'text-red-600 dark:text-red-500'
            }`}>
              {isContentViolation ? (
                <>
                  <li>服装描述是否包含不当内容</li>
                  <li>是否遵守平台内容政策</li>
                  <li>请尝试用更温和的描述重新生成</li>
                </>
              ) : (
                <>
                  <li>.env 文件中 NANO_BANANA_API_KEY 是否正确配置</li>
                  <li>NANO_BANANA_API_URL 是否设置为正确的 API 地址</li>
                  <li>网络连接是否正常</li>
                </>
              )}
            </ul>
          </div>
        )}
        
        {generatedImage && (
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              ✨ 试穿效果图：
            </h3>
            <img
              src={generatedImage}
              alt="Try-on Result"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
