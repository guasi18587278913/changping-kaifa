'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from '@/components/message-list';
import { Send, Loader2 } from 'lucide-react';
import { generateResponses } from '@/lib/api';

export function ArgumentForm() {
  const [opponentText, setOpponentText] = useState('');
  const [intensity, setIntensity] = useState([5]);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{
    opponent: string;
    intensity: number;
    responses: string[];
  }[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();

  // Set hasMounted to true after initial render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load history from localStorage only after component has mounted
  useEffect(() => {
    if (hasMounted) {
      const savedHistory = localStorage.getItem('argumentHistory');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Failed to parse history:', error);
        }
      }
    }
  }, [hasMounted]);

  // Save history to localStorage only after component has mounted
  useEffect(() => {
    if (hasMounted && history.length > 0) {
      localStorage.setItem('argumentHistory', JSON.stringify(history));
    }
  }, [history, hasMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentText.trim()) {
      toast({
        title: '请输入对方的话',
        description: '需要输入对方说的话才能生成回应',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponses([]);

    try {
      const generatedResponses = await generateResponses(opponentText, intensity[0]);
      
      setResponses(generatedResponses);
      
      // Add to history
      const newEntry = {
        opponent: opponentText,
        intensity: intensity[0],
        responses: generatedResponses,
      };
      
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep only last 10 items
      
    } catch (error) {
      console.error('Error generating responses:', error);
      toast({
        title: '生成失败',
        description: '无法生成回应，请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            对方的话
          </label>
          <Textarea
            placeholder="输入对方说的话，AI将为你生成强有力的回应..."
            value={opponentText}
            onChange={(e) => setOpponentText(e.target.value)}
            className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-gray-50/50 backdrop-blur-sm transition-all"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-800">
              语气强烈程度
            </label>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-lg">{intensity[0]}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {intensity[0] <= 3 ? '温和' : intensity[0] <= 7 ? '适中' : '强烈'}
              </span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-600 font-medium">
              <span>😊 温和</span>
              <span>🔥 强烈</span>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !opponentText.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              AI正在思考中...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              开始AI辩论
            </>
          )}
        </Button>
      </form>

      {responses.length > 0 && (
        <MessageList 
          opponentText={opponentText} 
          responses={responses} 
        />
      )}

      {/* Only render history section after component has mounted */}
      {hasMounted && history.length > 0 && responses.length === 0 && !isLoading && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            最近的辩论记录
          </h3>
          <div className="grid gap-4">
            {history.slice(0, 3).map((item, index) => (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl cursor-pointer hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200/50 hover:border-blue-200 group"
                onClick={() => {
                  setOpponentText(item.opponent);
                  setIntensity([item.intensity]);
                  setResponses(item.responses);
                }}
              >
                <p className="text-sm text-gray-700 line-clamp-2 font-medium group-hover:text-gray-800">{item.opponent}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                    强度: {item.intensity}/10
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">
                    {item.responses.length} 条回应 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}