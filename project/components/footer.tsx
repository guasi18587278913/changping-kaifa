export function Footer() {
  return (
    <footer className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-medium">© {new Date().getFullYear()} 吵架包赢 | Win Every Argument</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Powered by</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
              DeepSeek AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}