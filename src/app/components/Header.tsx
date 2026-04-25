import { Search, Menu, Bell, X, PenSquare, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* 로고 */}
            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
              <Link to="/" className="flex items-center shrink-0" aria-label="FinanceHub 홈">
                <img src="/logo.png" alt="FinanceHub 로고" className="h-10 sm:h-12 lg:h-14 w-auto object-contain" />
              </Link>

              {/* PC 네비게이션 */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                {['부동산', '주식', '코인', '경제분석'].map((item) => (
                  <Link key={item} to={`/?category=${item}`} className="text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 우측 */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* PC 검색 */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input type="text" placeholder="검색..." className="bg-transparent border-none outline-none text-sm w-32 lg:w-40" />
              </div>

              {/* 모바일 검색 */}
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="검색">
                {isSearchOpen ? <X className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-600" />}
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="알림">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              {/* 관리자: 글쓰기 버튼 */}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin/write')}
                  className="hidden sm:flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <PenSquare className="w-4 h-4" />
                  글 쓰기
                </button>
              )}

              {/* 로그인 / 유저 영역 */}
              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <img
                    src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? user.email ?? 'U')}&background=2563eb&color=fff`}
                    alt={user.displayName ?? ''}
                    className="w-8 h-8 rounded-full border-2 border-blue-200 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => signOut()}
                    className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors p-1"
                    aria-label="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden md:block bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  로그인
                </button>
              )}

              {/* 모바일 햄버거 */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 모바일 검색바 */}
          {isSearchOpen && (
            <div className="md:hidden pb-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input type="text" placeholder="검색어를 입력하세요..." className="bg-transparent border-none outline-none text-sm flex-1" autoFocus />
              </div>
            </div>
          )}

          {/* 모바일 드롭다운 */}
          {isMenuOpen && (
            <nav className="md:hidden py-3 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                {['부동산', '주식', '코인', '경제분석'].map((item) => (
                  <Link key={item} to={`/?category=${item}`} className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                    {item}
                  </Link>
                ))}
                <div className="pt-2 px-3 flex flex-col gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => { navigate('/admin/write'); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 transition-colors font-medium"
                    >
                      <PenSquare className="w-4 h-4" />
                      새 글 쓰기
                    </button>
                  )}
                  {user ? (
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email ?? 'U')}&background=2563eb&color=fff`}
                          alt=""
                          className="w-7 h-7 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-sm text-gray-700 truncate max-w-[150px]">{user.displayName ?? user.email}</span>
                      </div>
                      <button onClick={() => signOut()} className="text-sm text-red-500 hover:underline shrink-0">로그아웃</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setShowLogin(true); setIsMenuOpen(false); }}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-full hover:bg-gray-700 transition-colors font-medium"
                    >
                      로그인
                    </button>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* 로그인 모달 */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
