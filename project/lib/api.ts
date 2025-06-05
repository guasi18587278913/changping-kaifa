interface GenerateResponsesOptions {
  retries?: number;
  delayMs?: number;
}

export async function generateResponses(
  opponentText: string, 
  intensity: number,
  options: GenerateResponsesOptions = { retries: 2, delayMs: 1000 }
): Promise<string[]> {
  const { retries = 2, delayMs = 1000 } = options;
  
  let attempt = 0;
  let error;

  while (attempt <= retries) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opponentText,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.responses || [];
      
    } catch (err) {
      error = err;
      attempt++;
      
      if (attempt <= retries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // If all attempts fail, return fallback responses
  console.error('Failed to generate responses after retries:', error);
  return [
    "对不起，我现在无法生成回应。请稍后再试。",
    "服务器正忙，请稍后重新提交您的请求。",
    "网络连接问题，无法获取AI生成的回应。"
  ];
}