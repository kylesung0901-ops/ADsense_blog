import { Search, Menu, Bell, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* 로고 */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <a href="/" className="flex items-center shrink-0" aria-label="FinanceHub 홈">
              <img
                src="/logo.png"
                alt="FinanceHub 로고"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              />
            </a>

            {/* PC 네비게이션 */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <a href="#" className="text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors font-medium">부동산</a>
              <a href="#" className="text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors font-medium">주식</a>
              <a href="#" className="text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors font-medium">코인</a>
              <a href="#" className="text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors font-medium">경제분석</a>
            </nav>
          </div>

          {/* 우측 영역 */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* PC 검색바 */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="검색..."
                className="bg-transparent border-none outline-none text-sm w-32 lg:w-40"
              />
            </div>

            {/* 모바일 검색 버튼 */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="검색"
            >
              {isSearchOpen ? <X className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-600" />}
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="알림">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            <button className="hidden md:block bg-blue-600 text-white px-4 lg:px-6 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
              구독하기
            </button>

            {/* 모바일 햄버거 메뉴 */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                className="bg-transparent border-none outline-none text-sm flex-1"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* 모바일 드롭다운 메뉴 */}
        {isMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {['부동산', '주식', '코인', '경제분석'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 px-3">
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 transition-colors font-medium">
                  구독하기
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
