import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImagePlus, Save, ArrowLeft } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import RichEditor from '../components/RichEditor';

const CATEGORIES = ['부동산', '주식', '코인', '경제분석'];

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  featured: boolean;
}

const empty: FormData = {
  title: '',
  excerpt: '',
  content: '',
  category: '부동산',
  imageUrl: '',
  featured: false,
};

export default function AdminWrite() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [form, setForm] = useState<FormData>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!id;

  useEffect(() => {
    if (!isEdit) return;
    getDoc(doc(db, 'posts', id!)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          title: d.title ?? '',
          excerpt: d.excerpt ?? '',
          content: d.content ?? '',
          category: d.category ?? '부동산',
          imageUrl: d.imageUrl ?? '',
          featured: d.featured ?? false,
        });
        setImagePreview(d.imageUrl ?? '');
      }
    });
  }, [id, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.imageUrl;
    setUploading(true);
    const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
    const snap = await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(snap.ref);
    setUploading(false);
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.excerpt) {
      alert('제목, 요약, 본문은 필수입니다.');
      return;
    }
    setSaving(true);
    try {
      const finalImageUrl = await uploadImage();
      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        author: user?.displayName ?? '관리자',
        authorEmail: user?.email ?? '',
        views: 0,
        likes: 0,
        comments: 0,
      };
      if (isEdit) {
        await updateDoc(doc(db, 'posts', id!), payload);
        navigate(`/article/${id}`);
      } else {
        const docRef = await addDoc(collection(db, 'posts'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        navigate(`/article/${docRef.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">관리자 로그인 필요</h2>
          <p className="text-gray-500">kylesung0901@gmail.com 계정으로 로그인하세요.</p>
          <Link to="/" className="text-sm text-gray-400 hover:text-blue-600">홈으로 돌아가기</Link>
        </div>
        <LoginModal onClose={() => navigate('/')} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-gray-600 text-lg">관리자 권한이 없습니다. (로그인된 이메일: {user.email})</p>
          <Link to="/" className="text-blue-600 hover:underline">홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* 상단 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">뒤로</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? '포스트 수정' : '새 포스트 작성'}</h1>
          <div className="w-16" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 대표 이미지 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">대표 이미지</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-full h-48 sm:h-64 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 flex items-center justify-center"
            >
              {imagePreview
                ? <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImagePlus className="w-10 h-10" />
                    <span className="text-sm">클릭하여 대표 이미지 업로드</span>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {uploading && <p className="text-xs text-blue-500 mt-1">이미지 업로드 중...</p>}
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리 *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">추천 포스트 (메인 상단)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">제목 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="기사 제목을 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">요약 * <span className="text-gray-400 font-normal">(목록에 표시되는 짧은 설명)</span></label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                placeholder="기사 요약 (2~3문장으로 핵심 내용 요약)"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
          </div>

          {/* 리치 텍스트 에디터 본문 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <label className="block text-sm font-semibold text-gray-700">
                본문 * <span className="text-gray-400 font-normal">— 아래 에디터에서 신문사처럼 작성하세요</span>
              </label>
            </div>
            <RichEditor
              content={form.content}
              onChange={html => setForm(prev => ({ ...prev, content: html }))}
            />
          </div>

          {/* 발행 버튼 */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? '저장 중...' : isEdit ? '수정 완료' : '📰 포스트 발행'}
          </button>
        </form>
      </main>
    </div>
  );
}
