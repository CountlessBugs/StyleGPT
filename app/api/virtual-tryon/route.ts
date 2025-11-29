import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const outfit = formData.get('outfit') as string;

    if (!image || !outfit) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 将图片转换为 Base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 注意：这里使用的是示例 API 端点
    // 实际使用时需要替换为真实的 Nano Banana API 或其他图像生成服务
    // 由于 Nano Banana 的具体 API 可能不同，这里提供一个通用的实现框架
    
    const apiKey = process.env.NANO_BANANA_API_KEY;
    const apiUrl = process.env.NANO_BANANA_API_URL || 'https://api.nanobanana.ai/v1';
    const model = process.env.NANO_BANANA_MODEL || 'nano-banana-fast';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: '未配置 Nano Banana API',
          details: '请在 .env 文件中设置 NANO_BANANA_API_KEY',
        },
        { status: 400 }
      );
    }

    const requestPayload = {
      model: model,
      prompt: `A person wearing ${outfit}, fashion photography, high quality, realistic`,
      aspectRatio: 'auto',
      imageSize: '1K',
      urls: [`data:image/png;base64,${base64Image}`],
      shutProgress: false,
    };
    
    console.log('Calling Nano Banana API with:', {
      url: `${apiUrl}/draw/nano-banana`,
      model: model,
      promptLength: requestPayload.prompt.length,
      imageSizeKB: (base64Image.length / 1024).toFixed(2),
    });
    
    const response = await axios.post(
      `${apiUrl}/draw/nano-banana`,
      requestPayload,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
        responseType: 'text', // 重要：以文本形式接收 SSE 响应
      }
    );

    console.log('Nano Banana API response status:', response.status);
    console.log('Nano Banana API raw response:', response.data);

    // 处理 SSE 流式响应：解析 "data: {...}" 格式，收集所有进度信息
    let finalData = null;
    const progressUpdates: Array<{progress?: number, status?: string}> = [];
    
    if (typeof response.data === 'string') {
      // 分割 SSE 消息，每个消息以 "data: " 开头
      const lines = response.data.split('\n').filter(line => line.trim().startsWith('data:'));
      
      // 解析所有行以获取进度信息
      lines.forEach((line, index) => {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
        try {
          const data = JSON.parse(jsonStr);
          if (index === lines.length - 1) {
            // 最后一条消息是最终结果
            finalData = data;
          }
          // 收集所有包含 progress 或 status 的更新
          if (data.progress !== undefined || data.status) {
            progressUpdates.push({
              progress: data.progress,
              status: data.status,
            });
          }
        } catch (parseError) {
          console.error('Failed to parse SSE line:', jsonStr);
        }
      });
    } else {
      // 如果不是字符串，直接使用
      finalData = response.data;
    }

    if (!finalData) {
      console.error('Failed to parse API response');
      return NextResponse.json(
        {
          error: '无法解析 API 响应',
          rawResponse: response.data,
        },
        { status: 500 }
      );
    }

    // 根据 Nano Banana API 实际响应格式提取图像 URL
    // 响应结构: { results: [{ url: "...", content: "..." }], status: "succeeded", ... }
    let imageUrl = null;
    
    if (finalData.results && Array.isArray(finalData.results) && finalData.results.length > 0) {
      // 从 results 数组的第一个元素中获取 url
      imageUrl = finalData.results[0].url;
      console.log('Extracted imageUrl from results[0].url:', imageUrl);
    } else if (finalData.imageUrl) {
      // 备选：支持其他可能的响应格式
      imageUrl = finalData.imageUrl;
    } else if (finalData.output) {
      imageUrl = finalData.output;
    } else if (finalData.result) {
      imageUrl = finalData.result;
    } else if (finalData.image) {
      imageUrl = finalData.image;
    } else if (finalData.url) {
      imageUrl = finalData.url;
    }

    // 确保 imageUrl 不仅存在，而且是有效的字符串
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      // 检查是否是因为内容违规
      const isContentViolation = finalData.status?.includes('failed') || 
                                finalData.error?.includes('content') ||
                                finalData.message?.includes('违规') ||
                                finalData.message?.includes('content') ||
                                finalData.message?.includes('policy');
      
      console.error('No valid imageUrl found. imageUrl value:', imageUrl);
      console.error('Final parsed data:', finalData);
      
      const errorResponse = {
        error: 'API 响应中未找到图像 URL',
        receivedData: finalData,
        extractedUrl: imageUrl,
        supportedFormats: {
          primary: 'results[0].url',
          alternatives: ['imageUrl', 'output', 'result', 'image', 'url'],
        },
      };
      
      // 如果检测到内容违规，添加相关信息
      if (isContentViolation) {
        Object.assign(errorResponse, {
          possibleContentViolation: true,
          suggestion: '生成失败可能是因为内容违规或不符合服务条款，请修改描述重试',
        });
      }
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('Final imageUrl to return:', imageUrl);
    return NextResponse.json({ imageUrl, progressUpdates });
  } catch (error) {
    console.error('Error generating virtual try-on:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });
      
      // 提供更具体的错误信息
      const errorMessage = (() => {
        switch (error.response?.status) {
          case 400:
            return 'API 请求格式错误，请检查参数';
          case 401:
            return '未授权：API Key 可能无效或已过期';
          case 403:
            return '禁止访问：API Key 可能没有权限或已被限制';
          case 404:
            return 'API 端点不存在，请检查 URL 配置';
          case 429:
            return '请求过于频繁，请稍后重试';
          case 500:
            return 'API 服务器内部错误，请稍后重试';
          default:
            return `HTTP ${error.response?.status}: ${error.response?.statusText}`;
        }
      })();
      
      return NextResponse.json(
        {
          error: '调用 Nano Banana API 失败',
          message: errorMessage,
          details: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          },
        },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      {
        error: '调用 Nano Banana API 失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
