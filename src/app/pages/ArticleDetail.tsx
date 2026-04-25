import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Heart, ArrowLeft, Eye, MessageCircle, Bookmark, Share2, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { staticPosts, type Post } from '../../lib/staticPosts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContact from '../components/FloatingContact';
import AdBanner from '../components/AdBanner';
import { ImageWithFallback } from '../components/ImageWithFallback';

const categoryColors: Record<string, string> = {
  '부동산': 'bg-emerald-100 text-emerald-700',
  '주식': 'bg-blue-100 text-blue-700',
  '코인': 'bg-purple-100 text-purple-700',
  '경제분석': 'bg-orange-100 text-orange-700',
};

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);

    if (id.startsWith('static-')) {
      // 정적 포스트
      const found = staticPosts.find((p) => p.id === id);
      if (found) {
        setPost(found);
        setLikeCount(found.likes);
      }
      setLoading(false);
    } else {
      // Firestore 포스트
      const ref = doc(db, 'posts', id);
      getDoc(ref).then((snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Post;
          setPost(data);
          setLikeCount(data.likes ?? 0);
          // 조회수 증가
          updateDoc(ref, { views: increment(1) }).catch(() => {});
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-gray-500 text-lg">기사를 찾을 수 없습니다.</p>
          <Link to="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* 뒤로가기 - 히스토리 있으면 뒤로, 없으면 홈으로 */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">목록으로</span>
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* 대표 이미지 */}
          <div className="relative w-full h-56 sm:h-80 lg:h-96 overflow-hidden">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
              {post.category}
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{post.author[0]}</span>
                </div>
                <span className="font-medium text-gray-800">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.timeAgo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views?.toLocaleString()} 조회</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments} 댓글</span>
              </div>
            </div>

            {/* 본문 */}
            <div className="prose prose-gray max-w-none">
              <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                {post.excerpt}
              </p>
              <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {post.content}
              </div>
            </div>

            {/* 광고 */}
            <div className="my-8">
              <AdBanner />
            </div>

            {/* 좋아요 / 북마크 / 공유 */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full border transition-all ${
                    isBookmarked
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-600 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">공유</span>
              </button>
            </div>
          </div>
        </article>

        {/* 홈으로 */}
        <div className="flex justify-center mt-8">
          <Link
            to="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
          >
            다른 기사 보기
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
}
