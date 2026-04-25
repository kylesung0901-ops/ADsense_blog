import { Heart, MessageCircle, Eye, Bookmark, Share2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useState } from 'react';

interface BlogPostProps {
  id: number;
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const categoryColors: Record<string, string> = {
    '부동산': 'bg-emerald-100 text-emerald-700',
    '주식': 'bg-blue-100 text-blue-700',
    '코인': 'bg-purple-100 text-purple-700',
    '경제분석': 'bg-orange-100 text-orange-700'
  };

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-full">
      {/* 썸네일 이미지 */}
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

      {/* 콘텐츠 영역 */}
      <div className="p-4 sm:p-6">
        <h2 className={`${featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-xl'} font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug`}>
          {title}
        </h2>
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
            <span>{views.toLocaleString()}</span>
          </div>
        </div>

        {/* 좋아요, 댓글, 북마크, 공유 */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">{comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
