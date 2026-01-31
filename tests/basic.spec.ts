import { test, expect } from '@playwright/test';

/**
 * AI方舟 - 功能测试
 */

test.describe('首页加载', () => {
  test('页面标题正确', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI方舟/);
  });

  test('Logo和头部显示', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header').locator('text=AI方舟').first()).toBeVisible();
  });

  test('搜索框存在', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await expect(page.locator('#mobile-search')).toBeVisible();
    } else {
      await expect(page.locator('#global-search')).toBeVisible();
    }
  });

  test('侧边栏导航存在（桌面端）', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await expect(page.locator('#category-nav')).toBeHidden();
    } else {
      await expect(page.locator('#category-nav')).toBeVisible();
    }
  });

  test('工具网格显示', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tools-grid')).toBeVisible();
    // 等待工具加载
    await page.waitForTimeout(1000);
    const cards = page.locator('#tools-grid .tool-card');
    await expect(cards.first()).toBeVisible();
  });
});

test.describe('搜索功能', () => {
  test('搜索功能工作正常', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const searchInput = isMobile ? '#mobile-search' : '#global-search';
    await page.fill(searchInput, 'Tool');
    await page.waitForTimeout(500);
    
    // 检查是否有工具卡片显示
    const cards = page.locator('#tools-grid .tool-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('搜索无结果显示提示', async ({ page, isMobile }) => {
    await page.goto('/');
    const searchInput = isMobile ? '#mobile-search' : '#global-search';
    await page.fill(searchInput, 'xyz123nonexistent');
    await page.waitForTimeout(500);
    
    await expect(page.locator('#no-results')).toBeVisible();
  });
});

test.describe('分类导航', () => {
  test('分类导航存在', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      // On mobile, category nav is hidden in sidebar
      await expect(page.locator('#category-nav')).toBeHidden();
    } else {
      await expect(page.locator('#category-nav')).toBeVisible();
    }
  });

  test('点击分类筛选工具', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    if (!isMobile) {
      // 桌面端：点击第一个分类
      const firstCategory = page.locator('#category-nav .category-item').first();
      await firstCategory.click();
      await page.waitForTimeout(500);
      
      // 检查是否有工具显示
      const cards = page.locator('#tools-grid .tool-card');
      await expect(cards.first()).toBeVisible();
    }
  });
});

test.describe('工具卡片', () => {
  test('工具卡片显示正确', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const firstCard = page.locator('#tools-grid .tool-card').first();
    await expect(firstCard).toBeVisible();
    
    // 检查卡片内容
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3')).toBeVisible();
  });

  test('工具卡片有对比功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const firstCard = page.locator('#tools-grid .tool-card').first();
    // Check for the visible checkbox div, not the sr-only input
    const compareCheckboxVisual = firstCard.locator('.compare-checkbox-visual');
    await expect(compareCheckboxVisual).toBeVisible();
  });

  test('工具卡片有收藏功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const firstCard = page.locator('#tools-grid .tool-card').first();
    const favoriteBtn = firstCard.locator('button').filter({ has: page.locator('.fa-heart') });
    await expect(favoriteBtn.first()).toBeVisible();
  });
});

test.describe('对比功能', () => {
  test('对比按钮存在', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      // Compare button is hidden on mobile (has hidden lg:flex classes)
      await expect(page.locator('#compare-btn')).toBeHidden();
    } else {
      await expect(page.locator('#compare-btn')).toBeVisible();
    }
  });

  test('可以选择工具进行对比', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // 选择前两个工具进行对比 - click the label containing the checkbox
    const compareLabels = page.locator('#tools-grid .tool-card label:has(.compare-checkbox)');
    await compareLabels.nth(0).click();
    await page.waitForTimeout(200);
    await compareLabels.nth(1).click();
    await page.waitForTimeout(300);
    
    // 检查对比抽屉是否显示
    await expect(page.locator('#compare-drawer')).not.toHaveClass(/translate-y-full/);
  });
});

test.describe('收藏功能', () => {
  test('收藏按钮存在', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      // Favorites button is hidden on mobile (has hidden lg:flex classes)
      await expect(page.locator('#favorites-btn')).toBeHidden();
    } else {
      await expect(page.locator('#favorites-btn')).toBeVisible();
    }
  });
});

test.describe('登录功能', () => {
  test('登录按钮存在', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#login-btn')).toBeVisible();
  });

  test('点击登录按钮显示模态框', async ({ page }) => {
    await page.goto('/');
    await page.click('#login-btn');
    await page.waitForTimeout(300);
    
    await expect(page.locator('#login-modal')).not.toHaveClass(/hidden/);
  });

  test('关闭登录模态框', async ({ page }) => {
    await page.goto('/');
    await page.click('#login-btn');
    await page.waitForTimeout(300);
    
    // 点击关闭按钮 (X button in top right of modal)
    await page.click('#login-modal button:has(.fa-xmark)');
    await page.waitForTimeout(500);
    
    await expect(page.locator('#login-modal')).toHaveClass(/hidden/);
  });
});

test.describe('响应式布局', () => {
  test('移动端显示正确', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      // 移动端应该显示移动端搜索
      await expect(page.locator('#mobile-search')).toBeVisible();
      // 移动端分类导航应该隐藏
      await expect(page.locator('#category-nav')).toBeHidden();
    }
  });

  test('桌面端显示正确', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (!isMobile) {
      // 桌面端应该显示桌面端搜索
      await expect(page.locator('#global-search')).toBeVisible();
      // 桌面端分类导航应该显示
      await expect(page.locator('#category-nav')).toBeVisible();
    }
  });
});
