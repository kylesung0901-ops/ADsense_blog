export default function AdBanner() {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-dashed border-gray-300 my-5 sm:my-8 w-full">
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
        <div className="bg-white rounded-lg p-4 sm:p-8 flex items-center justify-center min-h-[80px] sm:min-h-[200px]">
          <p className="text-gray-400 text-xs sm:text-sm">Google AdSense 광고 영역 (콘텐츠 중간)</p>
        </div>
      </div>
    </div>
  );
}
