import { useEffect } from 'react';

export default function SEOHead() {
  useEffect(() => {
    document.title = 'FinanceHub - 부동산, 주식, 코인 투자 정보 | 금융 전문 블로그';

    const setMeta = (attrs: Record<string, string>, content: string) => {
      const selector = Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join('');
      let el = document.querySelector<HTMLMetaElement>(`meta${selector}`);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta({ name: 'description' }, '부동산, 주식, 코인 등 금융 시장의 최신 트렌드와 투자 인사이트를 제공하는 전문 금융 미디어입니다. 매일 업데이트되는 투자 정보와 시장 분석을 확인하세요.');
    setMeta({ name: 'keywords' }, '부동산, 주식, 코인, 비트코인, 이더리움, 투자, 금융, 경제, 시장분석, 재테크, ETF, 아파트');
    setMeta({ name: 'author' }, 'FinanceHub');
    setMeta({ name: 'robots' }, 'index, follow');
    setMeta({ property: 'og:title' }, 'FinanceHub - 부동산, 주식, 코인 투자 정보');
    setMeta({ property: 'og:description' }, '금융 시장의 최신 트렌드와 투자 인사이트를 제공하는 전문 금융 미디어');
    setMeta({ property: 'og:type' }, 'website');
    setMeta({ property: 'og:image' }, 'https://financehub.kr/logo.png');
    setMeta({ property: 'og:image:width' }, '1200');
    setMeta({ property: 'og:image:height' }, '630');
    setMeta({ property: 'og:site_name' }, 'FinanceHub');
    setMeta({ property: 'og:locale' }, 'ko_KR');
    setMeta({ name: 'twitter:card' }, 'summary_large_image');
    setMeta({ name: 'twitter:title' }, 'FinanceHub - 금융 전문 블로그');
    setMeta({ name: 'twitter:description' }, '부동산, 주식, 코인 투자 정보와 시장 분석');
    setMeta({ name: 'twitter:image' }, 'https://financehub.kr/logo.png');

    // AdSense 스크립트는 index.html에 직접 삽입됨 (ca-pub-2828377808327336)
  }, []);

  return null;
}
