import { Eye, Bookmark, Share2, Clock } from 'lucide-react';
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
  timeAgo,
  views,
  featured = false,
}: BlogPostProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const categoryColors: Record<string, string> = {
    '부동산': 'bg-emerald-100 text-emerald-700',
    '주식': 'bg-blue-100 text-blue-700',
    '코인': 'bg-purple-100 text-purple-700',
    '경제분석': 'bg-orange-100 text-orange-700',
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

      {/* 썸네일 */}
      <Link to={`/article/${id}`} className="block relative overflow-hidden" aria-label={title}>
        <div className={`relative overflow-hidden ${featured ? 'h-52 sm:h-72 md:h-96' : 'h-44 sm:h-52'}`}>
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>
            {category}
          </span>
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        {/* 제목 */}
        <Link to={`/article/${id}`}>
          <h2 className={`${featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'} font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug`}>
            {title}
          </h2>
        </Link>

        {/* 요약 */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{excerpt}</p>

        {/* 하단 메타 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {timeAgo && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {views?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
