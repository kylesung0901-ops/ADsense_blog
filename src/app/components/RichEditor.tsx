import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';
import { useRef } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link as LinkIcon,
  ImageIcon, Minus, Undo2, Redo2, Code,
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

// 커스텀 FontSize 확장
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: el => el.style.fontSize || null,
          renderHTML: attrs => attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands(): any {
    return {
      setFontSize: (size: string) => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: null }).run(),
    };
  },
});

const FONT_FAMILIES = [
  { label: '기본체', value: '' },
  { label: '나눔고딕', value: 'Nanum Gothic, sans-serif' },
  { label: '나눔명조', value: 'Nanum Myeongjo, serif' },
  { label: '맑은 고딕', value: 'Malgun Gothic, sans-serif' },
  { label: '돋움', value: 'Dotum, sans-serif' },
  { label: '굴림', value: 'Gulim, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
];

const FONT_SIZES = ['10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px','64px'];

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      ImageExt.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-4' } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[500px] p-6 text-gray-900',
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `posts/content/${Date.now()}_${file.name}`);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleLinkInsert = () => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      {/* ───── 툴바 ───── */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">

        {/* 폰트 패밀리 */}
        <select
          onChange={e => e.target.value
            ? editor.chain().focus().setFontFamily(e.target.value).run()
            : editor.chain().focus().unsetFontFamily().run()
          }
          className="h-8 text-xs border border-gray-300 rounded px-1 bg-white"
          title="글꼴"
        >
          {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* 폰트 크기 */}
        <select
          onChange={e => (editor.commands as any).setFontSize(e.target.value)}
          className="h-8 w-20 text-xs border border-gray-300 rounded px-1 bg-white"
          title="글씨 크기"
        >
          <option value="">크기</option>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <Divider />

        {/* 제목 */}
        {[1,2,3].map(level => (
          <ToolBtn
            key={level}
            active={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()}
            title={`제목 ${level}`}
          >
            <span className="text-xs font-bold">H{level}</span>
          </ToolBtn>
        ))}
        <ToolBtn
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="본문"
        >
          <span className="text-xs">P</span>
        </ToolBtn>

        <Divider />

        {/* 텍스트 스타일 */}
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게 (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울기 (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄 (Ctrl+U)">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="인라인 코드">
          <Code className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* 색상 */}
        <label className="relative" title="글자 색상">
          <div className="w-8 h-8 rounded flex items-center justify-center border border-gray-300 bg-white cursor-pointer hover:bg-gray-100">
            <span className="text-xs font-bold" style={{ color: editor.getAttributes('textStyle').color || '#000' }}>A</span>
          </div>
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>

        {/* 하이라이트 */}
        <label className="relative" title="형광펜">
          <div className="w-8 h-8 rounded flex items-center justify-center border border-gray-300 bg-white cursor-pointer hover:bg-gray-100">
            <span className="text-xs" style={{ background: '#fef08a', padding: '0 2px' }}>형</span>
          </div>
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            defaultValue="#fef08a"
            onChange={e => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          />
        </label>

        <Divider />

        {/* 정렬 */}
        <ToolBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="왼쪽 정렬">
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="가운데 정렬">
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="오른쪽 정렬">
          <AlignRight className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="양쪽 정렬">
          <AlignJustify className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* 목록 */}
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 기호">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용구">
          <Quote className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* 삽입 */}
        <ToolBtn active={editor.isActive('link')} onClick={handleLinkInsert} title="링크 삽입">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={false} onClick={() => fileRef.current?.click()} title="이미지 삽입">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          <Minus className="w-3.5 h-3.5" />
        </ToolBtn>

        <Divider />

        {/* 실행취소 / 다시실행 */}
        <ToolBtn active={false} onClick={() => editor.chain().focus().undo().run()} title="실행취소 (Ctrl+Z)">
          <Undo2 className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={false} onClick={() => editor.chain().focus().redo().run()} title="다시실행 (Ctrl+Y)">
          <Redo2 className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>

      {/* ───── 에디터 본문 ───── */}
      <div className="min-h-[500px] overflow-y-auto editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* 이미지 업로드 숨김 input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
      />
    </div>
  );
}

function ToolBtn({ children, onClick, active, title }: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded flex items-center justify-center transition-colors text-sm
        ${active
          ? 'bg-blue-600 text-white'
          : 'hover:bg-gray-200 text-gray-700 border border-gray-300 bg-white'
        }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-gray-300 mx-0.5" />;
}
