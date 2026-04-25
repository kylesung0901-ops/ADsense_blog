import { Heart, MessageCircle, Eye, Bookmark, Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './ImageWithFallback';
import { useState } from 'react';

interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: string;
  timeAgo: string;
  views: number;
  likes: number;
  comments: number;
  featured?: boolean;
}

export default function BlogPost({
  id,
  title,
  excerpt,
  category,
  imageUrl,
  author,
  timeAgo,
  views,
  likes,
  comments,
  featured = false
}: BlogPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const categoryColors: Record<string, string> = {
    '부동산': 'bg-emerald-100 text-emerald-700',
    '주식': 'bg-blue-100 text-blue-700',
    '코인': 'bg-purple-100 text-purple-700',
    '경제분석': 'bg-orange-100 text-orange-700'
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((c) => isLiked ? c - 1 : c + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${id}`;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다.');
    }
  };

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-full">
      {/* 이미지 - 클릭 시 기사 상세로 이동 */}
      <Link to={`/article/${id}`} className="block relative overflow-hidden" aria-label={title}>
        <div className={`relative overflow-hidden ${featured ? 'h-52 sm:h-72 md:h-96' : 'h-44 sm:h-56'}`}>
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>
            {category}
          </span>
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        {/* 제목 - 클릭 시 기사 상세로 이동 */}
        <Link to={`/article/${id}`}>
          <h2 className={`${featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-xl'} font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug`}>
            {title}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{excerpt}</p>

        {/* 작성자 & 조회수 */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{author[0]}</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{author}</p>
              <p className="text-xs text-gray-500 leading-tight">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{views?.toLocaleString()}</span>
          </div>
        </div>

        {/* 인터랙션 버튼 */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm">{likeCount}</span>
            </button>
            <Link to={`/article/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">{comments}</span>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleBookmark} className={`p-1.5 sm:p-2 rounded-full transition-colors ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}>
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
