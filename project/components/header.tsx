'use client';

import { MessageSquareText, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">吵架包赢</h1>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm font-medium">Win Every Argument</span>
          <button 
            onClick={() => setTheme('light')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors backdrop-blur-sm"
          >
            主题
          </button>
        </div>
      </div>
    </header>
  );
}