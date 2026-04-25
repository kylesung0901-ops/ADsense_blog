import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { staticPosts, type Post } from '../../lib/staticPosts';
import Header from '../components/Header';
import BlogPost from '../components/BlogPost';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import FloatingContact from '../components/FloatingContact';

export default function Home() {
  const [firestorePosts, setFirestorePosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timeAgo: formatTimeAgo(doc.data().createdAt?.toDate()),
      })) as Post[];
      setFirestorePosts(posts);
    });
    return unsub;
  }, []);

  // Firestore 포스트를 위에, 정적 포스트를 아래에 합침
  const allPosts = [...firestorePosts, ...staticPosts];
  const featuredPost = allPosts.find((p) => p.featured) ?? allPosts[0];
  const restPosts = allPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />

      {/* 헤더 하단 광고 */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
            <div className="bg-white rounded-lg p-4 sm:p-8 flex items-center justify-center min-h-[80px] sm:min-h-[120px]">
              <p className="text-gray-400 text-xs sm:text-sm">Google AdSense 광고 영역 (728x90 Leaderboard)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 fold:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-8">

          {/* 메인 콘텐츠 */}
          <div className="col-span-1 fold:col-span-2 lg:col-span-2">
            <div className="mb-5 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">추천 포스트</h2>
              <p className="text-sm sm:text-base text-gray-600">오늘의 주요 금융 뉴스를 확인하세요</p>
            </div>

            {featuredPost && (
              <div className="mb-5 sm:mb-8">
                <BlogPost {...featuredPost} featured />
              </div>
            )}

            <AdBanner />

            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">최신 포스트</h2>
              <p className="text-sm sm:text-base text-gray-600">방금 올라온 따끈따끈한 금융 소식</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {restPosts.map((post) => (
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

          {/* 사이드바 */}
          <div className="col-span-1">
            <Sidebar />
          </div>
        </div>
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
