import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || undefined,
});

const MODEL = process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo';

export async function POST(request: NextRequest) {
  try {
    const { style, wardrobeItems, plannedItems, season, temperature, budget } = await request.json();

    const prompt = `你是一位专业的时尚购物顾问。请根据以下信息提供详细的购买建议：

喜爱的穿搭风格：${style}
计划购买的衣物：${plannedItems}
${wardrobeItems ? `\n现有衣柜：${wardrobeItems}\n重要：请确保新购买的衣服能更好地与现有衣服搭配。` : ''}
${season ? `\n季节：${season}` : ''}
${temperature ? `\n气温：${temperature}` : ''}
${budget ? `\n预算范围：${budget}` : ''}

请提供：
1. 具体的单品推荐（包括款式、颜色、材质等）
2. 购买优先级排序
3. 与现有衣柜的搭配建议和实用性分析${wardrobeItems ? '（考虑现有衣物）' : ''}
4. 根据季节气温的布料/短并建议（如有季节/气温信息）
5. 预算分配建议（如有预算限制）
6. 品牌或购买渠道建议（可选）

请用友好、专业的语气给出建议，帮助用户做出明智的购买决策。`;

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的时尚购物顾问，擅长根据用户的风格偏好和需求提供个性化的购买建议。',
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
    console.error('Error generating purchase advice:', error);
    return NextResponse.json(
      { error: '生成购买建议失败' },
      { status: 500 }
    );
  }
}
