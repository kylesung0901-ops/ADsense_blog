import { useEffect, useState } from 'react';
import { TrendingUp, Mail, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImageWithFallback } from './ImageWithFallback';

interface PopularPost {
  id: number;
  title: string;
  imageUrl: string;
  articleId: string;
}

const POPULAR_POSTS: PopularPost[] = [
  {
    id: 1,
    title: '2026년 부동산 시장 전망: 금리 인하가 미치는 영향',
    imageUrl: 'https://images.unsplash.com/photo-1768223933860-6d62bc5b2ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    articleId: 'static-1',
  },
  {
    id: 2,
    title: '비트코인 반감기 이후 암호화폐 시장 분석',
    imageUrl: 'https://images.unsplash.com/photo-1672071673701-4c9a564c8046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    articleId: 'static-3',
  },
  {
    id: 3,
    title: 'AI 기술주 투자 가이드: 엔비디아 vs AMD',
    imageUrl: 'https://images.unsplash.com/photo-1638481826540-7710b13f7d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    articleId: 'static-2',
  },
];

export default function Sidebar() {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Firestore article_views 컬렉션에서 실제 조회수 로드
  useEffect(() => {
    const fetchViews = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        POPULAR_POSTS.map(async (post) => {
          try {
            const snap = await getDoc(doc(db, 'article_views', post.articleId));
            counts[post.articleId] = snap.exists() ? (snap.data().count ?? 0) : 0;
          } catch {
            counts[post.articleId] = 0;
          }
        })
      );
      setViewCounts(counts);
    };
    fetchViews();
  }, []);

  const categories = [
    { name: '부동산', count: null, color: 'bg-emerald-500' },
    { name: '주식', count: null, color: 'bg-blue-500' },
    { name: '코인', count: null, color: 'bg-purple-500' },
    { name: '경제분석', count: null, color: 'bg-orange-500' },
  ];

  return (
    <aside className="space-y-4 sm:space-y-6">

      {/* 광고 공간 1 */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
          <div className="bg-white rounded-lg p-6 sm:p-8 flex items-center justify-center min-h-[180px] sm:min-h-[250px]">
            <p className="text-gray-400 text-sm text-center">Google AdSense<br />광고 영역<br />(300x250)</p>
          </div>
        </div>
      </div>

      {/* 인기 포스트 */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">인기 포스트</h3>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {POPULAR_POSTS.map((post, index) => {
            const count = viewCounts[post.articleId];
            return (
              <Link
                key={post.id}
                to={`/article/${post.articleId}`}
                className="flex gap-3 group cursor-pointer items-start hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
              >
                <span className="text-xl sm:text-2xl font-bold text-gray-200 group-hover:text-blue-600 transition-colors leading-tight mt-0.5 shrink-0 w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1 leading-snug">
                    {post.title}
                  </h4>
                  {/* 실제 조회수만 표시 — 0이면 눈 아이콘만 */}
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {count ? count.toLocaleString() : ''}
                  </p>
                </div>
                <ImageWithFallback
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">카테고리</h3>
        <div className="space-y-2 sm:space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name}`}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-7 sm:h-8 ${cat.color} rounded-full`} />
                <span className="font-medium text-gray-700 group-hover:text-gray-900 text-sm sm:text-base">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 뉴스레터 구독 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="font-bold text-sm sm:text-base">뉴스레터 구독</h3>
        </div>
        <p className="text-xs sm:text-sm text-blue-100 mb-3 sm:mb-4 leading-relaxed">
          최신 금융 뉴스와 투자 인사이트를 매주 받아보세요
        </p>
        <input
          type="email"
          placeholder="이메일 주소"
          className="w-full px-3 sm:px-4 py-2 rounded-lg mb-2 sm:mb-3 text-gray-900 placeholder:text-gray-500 text-sm"
        />
        <button className="w-full bg-white text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
          구독하기
        </button>
      </div>

      {/* 광고 공간 2 */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
          <div className="bg-white rounded-lg p-6 sm:p-8 flex items-center justify-center min-h-[180px] sm:min-h-[250px]">
            <p className="text-gray-400 text-sm text-center">Google AdSense<br />광고 영역<br />(300x250)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
