import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || undefined,
});

const MODEL = process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo';

export async function POST(request: NextRequest) {
  try {
    const { style, wardrobeItems, season, temperature, occasion } = await request.json();

    const prompt = `你是一位专业的时尚穿搭顾问。请根据以下信息提供详细的穿搭方案：

穿搭风格：${style}
现有衣柜：${wardrobeItems}
${season ? `\n季节：${season}` : ''}
${temperature ? `\n气温：${temperature}` : ''}
${occasion ? `\n穿搭场合：${occasion}` : ''}

请提供：
1. 3-5套具体的穿搭组合建议
2. 每套搭配的详细说明和穿搭要点
3. 下软的场合和季节
4. 针毹当前气温的建议（如有季节/气温信息）
5. 配饰建议（如有必要）

请用友好、专业的语气给出建议，格式清晰易读。`;

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一位专业且热情的时尚穿搭顾问，擅长根据用户的服装和风格偏好提供个性化的穿搭建议。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error generating outfit:', error);
    return NextResponse.json(
      { error: '生成穿搭方案失败' },
      { status: 500 }
    );
  }
}
