import Header from './components/Header';
import BlogPost from './components/BlogPost';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import SEOHead from './components/SEOHead';
import FloatingContact from './components/FloatingContact';

export default function App() {
  const blogPosts = [
    {
      id: 1,
      title: '2026년 부동산 시장 대전망: 금리 인하 시대의 투자 전략',
      excerpt: '미국 연준의 금리 인하 사이클이 본격화되면서 국내 부동산 시장에도 변화의 바람이 불고 있습니다. 서울 강남권을 중심으로 거래량이 증가하고 있으며, 전세가율 상승세가 지속되고 있습니다.',
      category: '부동산',
      imageUrl: 'https://images.unsplash.com/photo-1768223933860-6d62bc5b2ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
      author: '김재무',
      timeAgo: '15분 전',
      views: 3542,
      likes: 247,
      comments: 38,
      featured: true
    },
    {
      id: 2,
      title: 'AI 반도체 전쟁: 엔비디아 vs AMD 심층 분석',
      excerpt: '생성형 AI 시대를 맞아 반도체 업계의 경쟁이 치열해지고 있습니다. 엔비디아의 독주 체제에 AMD가 강력한 도전장을 내밀며 투자자들의 관심이 집중되고 있습니다.',
      category: '주식',
      imageUrl: 'https://images.unsplash.com/photo-1638481826540-7710b13f7d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '박테크',
      timeAgo: '1시간 전',
      views: 2891,
      likes: 189,
      comments: 42
    },
    {
      id: 3,
      title: '비트코인 ETF 승인 1년, 암호화폐 시장의 변화',
      excerpt: '비트코인 현물 ETF 승인 이후 기관 투자자들의 유입이 본격화되고 있습니다. 시장 구조가 성숙해지면서 변동성은 줄어들고 있지만, 새로운 투자 기회도 생겨나고 있습니다.',
      category: '코인',
      imageUrl: 'https://images.unsplash.com/photo-1672071673701-4c9a564c8046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '이크립토',
      timeAgo: '2시간 전',
      views: 2156,
      likes: 156,
      comments: 29
    },
    {
      id: 4,
      title: '서울 아파트 가격 상승률 분석: 지역별 투자 포인트',
      excerpt: '최근 3개월간 서울 아파트 가격 상승률을 분석한 결과, 강남3구를 중심으로 상승세가 두드러지고 있습니다. 하지만 일부 지역에서는 관망세가 이어지고 있어 지역별 차별화 전략이 필요합니다.',
      category: '부동산',
      imageUrl: 'https://images.unsplash.com/photo-1771911651523-e050dc4189ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '정부동산',
      timeAgo: '3시간 전',
      views: 1842,
      likes: 124,
      comments: 31
    },
    {
      id: 5,
      title: '테슬라 실적 발표 분석: 주가 전망과 투자 전략',
      excerpt: '테슬라의 최신 분기 실적이 시장 예상을 상회하며 발표되었습니다. 전기차 판매량 증가와 에너지 사업 성장이 주요 호재로 작용했으며, 완전자율주행 기술의 진전도 주목받고 있습니다.',
      category: '주식',
      imageUrl: 'https://images.unsplash.com/photo-1766218329569-53c9270bb305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '최주식',
      timeAgo: '4시간 전',
      views: 1623,
      likes: 98,
      comments: 22
    },
    {
      id: 6,
      title: '이더리움 상하이 업그레이드 2.0: 무엇이 달라지나',
      excerpt: '이더리움 네트워크의 대규모 업그레이드가 예정되어 있습니다. 거래 속도 개선과 수수료 절감이 기대되며, DeFi 생태계에 미칠 영향을 분석해봅니다.',
      category: '코인',
      imageUrl: 'https://images.unsplash.com/photo-1641580556045-9d4cbe31e936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '강블록체인',
      timeAgo: '5시간 전',
      views: 1456,
      likes: 87,
      comments: 19
    },
    {
      id: 7,
      title: '2026 경제 전망: 인플레이션과 금리 정책의 향방',
      excerpt: '글로벌 중앙은행들의 통화정책 방향과 인플레이션 추이를 분석하여 2026년 하반기 경제 전망을 제시합니다. 투자자들이 주목해야 할 핵심 지표들을 정리했습니다.',
      category: '경제분석',
      imageUrl: 'https://images.unsplash.com/photo-1605759062013-e69aeb188665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      author: '송경제',
      timeAgo: '6시간 전',
      views: 1289,
      likes: 76,
      comments: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <SEOHead />
      <Header />

      {/* 헤더 하단 광고 배너 - 모바일에서 전체 너비 */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
            <div className="bg-white rounded-lg p-4 sm:p-8 flex items-center justify-center min-h-[80px] sm:min-h-[120px]">
              <p className="text-gray-400 text-xs sm:text-sm">Google AdSense 광고 영역 (헤더 하단 - 728x90 Leaderboard)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* PC: 2/3 콘텐츠 + 1/3 사이드바 | Z Fold 내부 화면: fold 브레이크포인트에서 같은 레이아웃 | 모바일: 단일 컬럼 */}
        <div className="grid grid-cols-1 fold:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-8">

          {/* 메인 콘텐츠 영역 */}
          <div className="col-span-1 fold:col-span-2 lg:col-span-2">
            <div className="mb-5 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">추천 포스트</h2>
              <p className="text-sm sm:text-base text-gray-600">오늘의 주요 금융 뉴스를 확인하세요</p>
            </div>

            {/* 피처드 포스트 - 전체 너비 */}
            <div className="mb-5 sm:mb-8">
              <BlogPost {...blogPosts[0]} />
            </div>

            <AdBanner />

            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">최신 포스트</h2>
              <p className="text-sm sm:text-base text-gray-600">방금 올라온 따끈따끈한 금융 소식</p>
            </div>

            {/* 최신 포스트 그리드 - 모바일 1열, 태블릿+ 2열 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {blogPosts.slice(1).map((post) => (
                <BlogPost key={post.id} {...post} />
              ))}
            </div>

            <AdBanner />

            <div className="flex justify-center mt-6 sm:mt-8">
              <button className="bg-white border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors font-medium text-sm sm:text-base w-full sm:w-auto max-w-xs">
                더 많은 포스트 보기
              </button>
            </div>
          </div>

          {/* 사이드바 - 모바일에서는 메인 콘텐츠 아래에 위치 */}
          <div className="col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />

      {/* 모바일 플로팅 문의 버튼 (카카오톡 + 전화) */}
      <FloatingContact />
    </div>
  );
}
