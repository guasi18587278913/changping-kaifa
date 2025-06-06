import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize OpenAI client with safe defaults
function createOpenAIClient() {
  return new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key-for-build',
    defaultHeaders: {
      "HTTP-Referer": "https://changping-kaifa.vercel.app",
      "X-Title": "吵架包赢",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          error: 'API密钥未配置',
          responses: [
            "API密钥未配置，请检查环境变量设置。",
            "无法连接到AI服务，请联系管理员。",
            "服务配置有误，暂时无法提供服务。"
          ]
        },
        { status: 500 }
      );
    }

    const { opponentText, intensity } = await request.json();

    if (!opponentText || typeof intensity !== 'number') {
      return NextResponse.json(
        { error: '参数无效' },
        { status: 400 }
      );
    }

    const systemPrompt = `你是一位能够生成强有力回怼语句的助手。根据对方说的话，你需要生成三条强有力的回应，帮助用户在争论中获胜。
语气强度级别：${intensity}/10（1是温和有礼的反驳，10是极其强硬的回怼）。
请直接输出三条回应，每条回应用"回应1："、"回应2："、"回应3："开头，不要有任何解释或前言。回应应该简洁有力，打字时长度不超过100个字。`;

    const userPrompt = `对方说：${opponentText}
请根据这句话，给我生成三条强有力的回应，帮助我在争论中获胜。请确保回应语气强度为${intensity}/10级别。`;

    const client = createOpenAIClient();
    const completion = await client.chat.completions.create({
      model: "google/gemini-flash-1.5-8b",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7 + (intensity * 0.03),
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Extract responses from the raw text using regex
    const responses: string[] = [];
    const regex = /回应\d+[:：](.+?)(?=回应\d+[:：]|$)/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) {
        responses.push(match[1].trim());
      }
    }
    
    // If no responses found with regex, split by newlines and take up to 3 items
    if (responses.length === 0) {
      const lines = content.split('\n').filter((line: string) => line.trim());
      for (let i = 0; i < Math.min(3, lines.length); i++) {
        responses.push(lines[i].replace(/^回应\d+[:：]\s*/, '').trim());
      }
    }
    
    // Ensure we have exactly 3 responses
    while (responses.length < 3) {
      responses.push("对不起，无法生成更多回应。");
    }
    
    return NextResponse.json({ 
      responses: responses.slice(0, 3) 
    });

  } catch (error) {
    console.error('API调用错误:', error);
    return NextResponse.json(
      { 
        error: '生成回应失败',
        responses: [
          "对不起，我现在无法生成回应。请稍后再试。",
          "服务器正忙，请稍后重新提交您的请求。",
          "网络连接问题，无法获取AI生成的回应。"
        ]
      },
      { status: 500 }
    );
  }
} 