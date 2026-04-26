import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { staticPosts, type Post } from '../../lib/staticPosts';
import Header from '../components/Header';
import BlogPost from '../components/BlogPost';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import FloatingContact from '../components/FloatingContact';
import { ArrowLeft } from 'lucide-react';

const categoryColors: Record<string, string> = {
  '부동산': 'from-emerald-500 to-teal-600',
  '주식': 'from-blue-500 to-indigo-600',
  '코인': 'from-purple-500 to-violet-600',
  '경제분석': 'from-orange-500 to-amber-600',
};

const categoryDesc: Record<string, string> = {
  '부동산': '아파트, 토지, 상가 등 부동산 시장의 최신 트렌드와 투자 전략을 분석합니다.',
  '주식': '국내외 주식 시장 동향, 종목 분석, 투자 전략을 제공합니다.',
  '코인': '비트코인, 이더리움 등 암호화폐 시장 분석과 블록체인 트렌드를 다룹니다.',
  '경제분석': '금리, 환율, 물가 등 거시경제 지표와 글로벌 경제 동향을 분석합니다.',
};

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const [firestorePosts, setFirestorePosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!name) return;
    const q = query(
      collection(db, 'posts'),
      where('category', '==', name),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timeAgo: formatTimeAgo(d.data().createdAt?.toDate()),
      })) as Post[];
      setFirestorePosts(posts);
    }, () => {});
    return unsub;
  }, [name]);

  const staticFiltered = staticPosts.filter(p => p.category === name);
  const allPosts = [...firestorePosts, ...staticFiltered];
  const gradient = categoryColors[name ?? ''] ?? 'from-gray-500 to-gray-600';
  const desc = categoryDesc[name ?? ''] ?? '';

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />

      {/* 카테고리 히어로 */}
      <div className={`bg-gradient-to-r ${gradient} text-white py-10 sm:py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{name}</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl">{desc}</p>
          <div className="mt-4 text-white/70 text-sm">총 {allPosts.length}개 기사</div>
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        {allPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">아직 등록된 기사가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {allPosts.map((post, i) => (
                <BlogPost key={post.id} {...post} featured={i === 0} />
              ))}
            </div>
            <AdBanner />
          </>
        )}
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
}

function formatTimeAgo(date?: Date): string {
  if (!date) return '';
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}
