'use client';

import { useToast } from '@/hooks/use-toast';
import { Copy, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageListProps {
  opponentText: string;
  responses: string[];
}

export function MessageList({ opponentText, responses }: MessageListProps) {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copiedIndex]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast({
        title: "已复制到剪贴板",
        description: "现在可以粘贴到聊天中了",
      });
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-gray-800">💡 AI回应建议</h3>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
          {responses.length} 条
        </span>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Opponent message */}
        <div className="flex justify-start">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 max-w-[85%] shadow-sm border border-gray-200">
            <div className="flex items-start gap-2">
              <span className="text-lg">👤</span>
              <p className="text-gray-700 font-medium">{opponentText}</p>
            </div>
          </div>
        </div>
        
        {/* Response messages */}
        {responses.map((response, index) => (
          <div key={index} className="flex flex-col items-end gap-3 mt-2">
            <div 
              className={cn(
                "animate-in fade-in-50 duration-300 slide-in-from-right-5",
                {"delay-150": index === 0},
                {"delay-300": index === 1},
                {"delay-500": index === 2}
              )}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 max-w-[85%] shadow-lg relative group">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <p className="text-white font-medium pr-2">{response}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                  onClick={() => copyToClipboard(response, index)}
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="h-4 w-4 text-green-300" />
                  ) : (
                    <Copy className="h-4 w-4 text-white/80" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-full px-4"
              onClick={() => copyToClipboard(response, index)}
            >
              {copiedIndex === index ? "✅ 已复制" : "📋 复制这条回应"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}