import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArgumentForm } from '@/components/argument-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">开始你的AI辩论</h2>
          <p className="text-gray-600 text-lg">智能生成强有力的回应，让你在任何争论中都能胜出</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <ArgumentForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}