import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onClose: () => void;
}

type Tab = 'login' | 'signup' | 'reset';

const ERROR_MAP: Record<string, string> = {
  'auth/user-not-found': '등록되지 않은 이메일입니다. 회원가입 탭에서 먼저 계정을 만드세요.',
  'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/email-already-in-use': '이미 가입된 이메일입니다. 로그인 탭을 이용하세요.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
  'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
  'auth/too-many-requests': '시도 횟수 초과. 잠시 후 다시 시도해주세요.',
  'auth/popup-closed-by-user': '',
  'auth/unauthorized-domain': '도메인 인증 오류입니다. 이메일/비밀번호로 로그인하세요.',
};

export default function LoginModal({ onClose }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleGoogle = async () => {
    setLoading(true);
    clearMessages();
    await signInWithGoogle();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (e: any) {
      setError(ERROR_MAP[e.code] ?? e.message ?? '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      await signUpWithEmail(email, password);
      onClose();
    } catch (e: any) {
      setError(ERROR_MAP[e.code] ?? e.message ?? '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      await resetPassword(email);
      setSuccess(`${email} 으로 비밀번호 재설정 이메일을 전송했습니다.`);
    } catch (e: any) {
      setError(ERROR_MAP[e.code] ?? '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FinanceHub" className="h-8 w-auto" />
            <span className="font-bold text-gray-900">관리자 로그인</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* 탭 */}
          {tab !== 'reset' && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              {(['login', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); clearMessages(); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'login' ? '로그인' : '회원가입'}
                </button>
              ))}
            </div>
          )}

          {/* 에러 / 성공 메시지 */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 mb-4 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {tab === 'login' && (
            <>
              {/* 안내 문구 */}
              {tab === 'login' && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 text-sm text-blue-700">
                  <strong>kylesung0901@gmail.com</strong> 계정으로 로그인하세요.<br />
                  <span className="text-xs text-blue-500">처음이라면 「회원가입」 탭에서 계정을 먼저 만드세요.</span>
                </div>
              )}

              {/* 이메일 로그인 폼 */}
              <form onSubmit={handleEmailLogin} className="space-y-3 mb-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => { setTab('reset'); clearMessages(); }} className="text-xs text-blue-500 hover:underline">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {loading ? '로그인 중...' : '이메일로 로그인'}
                </button>
              </form>

              {/* 구분선 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">또는</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google 로그인 (보조) */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-all text-gray-600 text-sm disabled:opacity-60"
              >
                <div className="flex items-center gap-2">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  Google로 로그인
                </div>
                <span className="text-xs text-gray-400">클릭하면 Google 페이지로 이동</span>
              </button>
            </>
          )}

          {/* 회원가입 탭 */}
          {tab === 'signup' && (
            <>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
                관리자 이메일 <strong>kylesung0901@gmail.com</strong> 만 가입 가능합니다.
              </div>
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 (6자 이상)"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {loading ? '가입 중...' : '계정 만들기'}
                </button>
              </form>
            </>
          )}

          {/* 비밀번호 재설정 */}
          {tab === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-gray-500">가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
                {loading ? '전송 중...' : '재설정 메일 보내기'}
              </button>
              <button type="button" onClick={() => { setTab('login'); clearMessages(); }} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← 로그인으로 돌아가기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
