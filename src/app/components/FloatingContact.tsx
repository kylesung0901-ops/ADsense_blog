import { Phone } from 'lucide-react';
import { useState } from 'react';

export default function FloatingContact() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 lg:hidden">
      {/* 카카오톡 문의 */}
      <a
        href="https://open.kakao.com/o/financehub"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 rounded-full shadow-lg transition-all duration-300 active:scale-95
          ${expanded
            ? 'bg-[#FEE500] text-yellow-900 px-4 py-3 opacity-100 translate-x-0'
            : 'bg-[#FEE500] text-yellow-900 w-14 h-14 justify-center opacity-100'
          }`}
        aria-label="카카오톡 문의"
      >
        {/* 카카오톡 말풍선 아이콘 SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.528 5.09 3.857 6.573-.17.58-.55 2.076-.63 2.404-.1.41.15.404.316.294.13-.088 2.033-1.36 2.853-1.907A11.3 11.3 0 0012 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"
            fill="currentColor"
          />
        </svg>
        {expanded && <span className="text-sm font-bold whitespace-nowrap">카카오톡 문의</span>}
      </a>

      {/* 전화 문의 */}
      <a
        href="tel:010-0000-0000"
        className={`flex items-center gap-2 rounded-full shadow-lg transition-all duration-300 active:scale-95
          ${expanded
            ? 'bg-blue-600 text-white px-4 py-3 opacity-100 translate-x-0'
            : 'bg-blue-600 text-white w-14 h-14 justify-center opacity-100'
          }`}
        aria-label="전화 문의"
      >
        <Phone className="w-5 h-5 shrink-0" />
        {expanded && <span className="text-sm font-bold whitespace-nowrap">전화 문의</span>}
      </a>

      {/* 펼치기/접기 토글 버튼 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-10 h-10 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all duration-200"
        aria-label={expanded ? '접기' : '문의하기'}
      >
        <span className="text-lg leading-none">{expanded ? '×' : '?'}</span>
      </button>
    </div>
  );
}
