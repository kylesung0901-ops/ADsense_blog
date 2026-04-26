import { test, expect } from '@playwright/test';

const BASE = 'https://a-dsense-blog.vercel.app';

test.describe('홈페이지', () => {
  test('사이트 로드 및 타이틀 확인', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/FinanceHub/);
    console.log('✅ 타이틀 정상:', await page.title());
  });

  test('로고 이미지 표시', async ({ page }) => {
    await page.goto(BASE);
    const logo = page.locator('img[alt="FinanceHub 로고"]').first();
    await expect(logo).toBeVisible();
    console.log('✅ 로고 이미지 정상');
  });

  test('PC: 네비게이션 메뉴 표시', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE);
    for (const menu of ['부동산', '주식', '코인', '경제분석']) {
      await expect(page.locator('nav').first().getByText(menu)).toBeVisible();
    }
    console.log('✅ PC 네비게이션 메뉴 정상');
  });

  test('모바일: 햄버거 메뉴 열면 네비게이션 표시', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    // 햄버거 버튼 (Menu 또는 닫기 아이콘 포함 버튼)
    const hamburger = page.locator('button[aria-label]').filter({ hasText: '' }).last();
    const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    await menuBtn.click();
    await page.waitForTimeout(500);
    // 네비게이션이 보이는지 확인 (부동산 텍스트)
    const menuVisible = await page.getByText('부동산').count();
    expect(menuVisible).toBeGreaterThan(0);
    console.log('✅ 모바일 햄버거 메뉴 네비게이션 정상');
  });

  test('블로그 포스트 카드 렌더링', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ 포스트 카드 ${count}개 렌더링`);
  });

  test('PC: 로그인 버튼 표시', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE);
    await expect(page.getByText('로그인').first()).toBeVisible();
    console.log('✅ PC 로그인 버튼 정상');
  });

  test('모바일: 햄버거 메뉴에 로그인 버튼', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    await menuBtn.click();
    await page.waitForTimeout(300);
    const loginCount = await page.getByText('로그인').count();
    expect(loginCount).toBeGreaterThan(0);
    console.log('✅ 모바일 로그인 버튼 정상');
  });
});

test.describe('기사 상세 페이지', () => {
  test('첫 번째 기사 클릭 → 상세 페이지 이동', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    const firstTitle = page.locator('article h2').first();
    await firstTitle.click();
    await page.waitForURL(/\/article\/.+/, { timeout: 10000 });
    await page.waitForTimeout(1000);
    console.log(`✅ 기사 상세 이동: ${page.url()}`);
    await expect(page.locator('article').first()).toBeVisible();
    console.log('✅ 기사 본문 렌더링 정상');
  });

  test('상세 페이지 새로고침 시 404 없음', async ({ page }) => {
    await page.goto(`${BASE}/article/static-1`);
    await expect(page).not.toHaveTitle(/404/);
    await expect(page.locator('article')).toBeVisible();
    console.log('✅ 상세 페이지 새로고침 정상 (404 없음)');
  });

  test('목록으로 버튼 → 홈으로 이동', async ({ page }) => {
    await page.goto(`${BASE}/article/static-1`);
    await page.waitForTimeout(1000);
    await page.getByText('목록으로').click();
    await page.waitForURL(BASE + '/', { timeout: 8000 });
    console.log('✅ 목록으로 버튼 정상 (홈 이동)');
  });

  test('기사 제목 본문에 표시', async ({ page }) => {
    await page.goto(`${BASE}/article/static-1`);
    await page.waitForTimeout(1000);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const title = await h1.textContent();
    expect(title?.length).toBeGreaterThan(5);
    console.log(`✅ 기사 제목: ${title}`);
  });

  test('좋아요 버튼 클릭', async ({ page }) => {
    await page.goto(`${BASE}/article/static-1`);
    await page.waitForTimeout(1500);
    // 하트 아이콘이 있는 버튼 (좋아요)
    const likeBtn = page.locator('button').filter({ hasText: /^\d+$/ }).first();
    await likeBtn.click({ timeout: 5000 });
    console.log('✅ 좋아요 버튼 클릭 정상');
  });

  test('공유 버튼 존재', async ({ page }) => {
    await page.goto(`${BASE}/article/static-1`);
    await page.waitForTimeout(1000);
    await expect(page.getByText('공유')).toBeVisible();
    console.log('✅ 공유 버튼 정상');
  });
});

test.describe('관리자 글쓰기 페이지', () => {
  test('비로그인 시 로그인 안내 표시', async ({ page }) => {
    await page.goto(`${BASE}/admin/write`);
    await page.waitForTimeout(1500);
    await expect(page.getByText('관리자 로그인 필요')).toBeVisible();
    console.log('✅ 미인증 접근 차단 정상');
  });

  test('홈으로 돌아가기 링크 존재', async ({ page }) => {
    await page.goto(`${BASE}/admin/write`);
    await page.waitForTimeout(1500);
    await expect(page.getByText('홈으로 돌아가기')).toBeVisible();
    console.log('✅ 홈으로 돌아가기 링크 정상');
  });
});

test.describe('모바일 반응형', () => {
  test('모바일(390px): 포스트 카드 렌더링', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    await expect(page.locator('article').first()).toBeVisible();
    console.log('✅ 모바일(390px) 카드 렌더링 정상');
  });

  test('모바일: 플로팅 문의 버튼', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    await expect(page.locator('button[aria-label="문의하기"]')).toBeVisible();
    console.log('✅ 모바일 플로팅 버튼 정상');
  });

  test('Samsung Z Fold 7 커버 (~362px)', async ({ page }) => {
    await page.setViewportSize({ width: 362, height: 832 });
    await page.goto(BASE);
    await page.waitForTimeout(1000);
    await expect(page.locator('article').first()).toBeVisible();
    console.log('✅ Z Fold 커버(362px) 정상');
  });

  test('Samsung Z Fold 7 펼침 (~919px)', async ({ page }) => {
    await page.setViewportSize({ width: 919, height: 1080 });
    await page.goto(BASE);
    await page.waitForTimeout(1000);
    await expect(page.locator('article').first()).toBeVisible();
    console.log('✅ Z Fold 펼침(919px) 정상');
  });

  test('PC(1280px): 사이드바 표시', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE);
    await page.waitForTimeout(1000);
    await expect(page.locator('aside')).toBeVisible();
    console.log('✅ PC 사이드바 정상');
  });
});

test.describe('SEO & 메타 태그', () => {
  test('og:image 메타 태그 존재', async ({ page }) => {
    await page.goto(BASE);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    console.log(`✅ og:image: ${ogImage}`);
  });

  test('파비콘 설정 (logo.png)', async ({ page }) => {
    await page.goto(BASE);
    const favicon = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(favicon).toContain('logo.png');
    console.log(`✅ 파비콘: ${favicon}`);
  });

  test('한국어 lang 속성', async ({ page }) => {
    await page.goto(BASE);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('ko');
    console.log(`✅ lang 속성: ${lang}`);
  });
});
