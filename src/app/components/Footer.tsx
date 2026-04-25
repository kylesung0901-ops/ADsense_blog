import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 sm:mt-20 w-full">
      {/* 푸터 상단 광고 */}
      <div className="bg-gray-100 py-5 sm:py-8 w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
            <div className="bg-white rounded-lg p-5 sm:p-8 flex items-center justify-center min-h-[100px] sm:min-h-[200px] border-2 border-dashed border-gray-300">
              <p className="text-gray-400 text-xs sm:text-sm">Google AdSense 광고 영역 (Footer 상단)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 푸터 콘텐츠 그리드 - 모바일 2열, 태블릿+ 4열 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">

          {/* 브랜드 소개 - 모바일에서 2열 전체 */}
          <div className="col-span-2 md:col-span-2">
            <a href="/" className="flex items-center mb-3 sm:mb-4" aria-label="FinanceHub 홈">
              <img
                src="/logo.png"
                alt="FinanceHub 로고"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>
            <p className="text-gray-400 mb-4 text-xs sm:text-sm leading-relaxed">
              부동산, 주식, 코인 등 금융 시장의 최신 트렌드와 투자 인사이트를 제공하는 전문 금융 미디어입니다.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {[Facebook, Twitter, Instagram, Youtube, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label="소셜 미디어"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">카테고리</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {['부동산', '주식', '코인', '경제분석'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs sm:text-sm hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">정보</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {['회사 소개', '광고 문의', '개인정보처리방침', '이용약관'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs sm:text-sm hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm leading-relaxed">
            © 2026 FinanceHub. All rights reserved.<br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>본 콘텐츠의 저작권은 FinanceHub에 있으며 무단 전재 및 재배포를 금지합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
