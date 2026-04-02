import { test, expect } from '@playwright/test';
import { BookStorePage } from '../../src/ui/pages/bookStore.page';
import { BOOKS, TOTAL_BOOKS } from '../../src/ui/data/books';

test.describe('COR-1: Search filters books by title keyword', () => {
  let bookStore: BookStorePage;

  test.beforeEach(async ({ page }) => {
    bookStore = new BookStorePage(page);
    await bookStore.open();
  });

  test('should display all books when search box is empty', async () => {
    const count = await bookStore.getVisibleBookCount();
    expect(count, `Expected all ${TOTAL_BOOKS} books to be visible`).toBe(TOTAL_BOOKS);
  });

  test('should filter books by exact title keyword', async () => {
    await bookStore.searchFor('Git');

    const titles = await bookStore.getVisibleBookTitles();
    expect(titles, 'Only "Git Pocket Guide" should match "Git"').toEqual(['Git Pocket Guide']);
  });

  test('should filter books by partial title keyword', async () => {
    await bookStore.searchFor('JavaScript');

    const titles = await bookStore.getVisibleBookTitles();
    const expectedTitles = BOOKS
      .filter(b => b.title.includes('JavaScript'))
      .map(b => b.title);

    expect(titles.length, 'Multiple books should match "JavaScript"').toBeGreaterThan(1);
    expect(titles.sort(), 'All books with "JavaScript" in title should appear').toEqual(expectedTitles.sort());
  });

  test('should show no results for non-matching keyword', async () => {
    await bookStore.searchFor('NonExistentBookTitle');

    const hasNoResults = await bookStore.hasNoResults();
    expect(hasNoResults, 'Table should be empty for non-matching search').toBe(true);
  });

  test('should restore all books when search is cleared', async () => {
    await bookStore.searchFor('Git');
    const filteredCount = await bookStore.getVisibleBookCount();
    expect(filteredCount, 'Should have filtered results').toBeLessThan(TOTAL_BOOKS);

    await bookStore.clearSearch();
    const restoredCount = await bookStore.getVisibleBookCount();
    expect(restoredCount, 'All books should be restored after clearing search').toBe(TOTAL_BOOKS);
  });

  test('should filter results as user types incrementally', async () => {
    await bookStore.searchFor('Sp');
    const afterSp = await bookStore.getVisibleBookTitles();
    expect(afterSp, '"Speaking JavaScript" should match "Sp"').toContain('Speaking JavaScript');

    await bookStore.searchFor('Speaking');
    const afterFull = await bookStore.getVisibleBookTitles();
    expect(afterFull, 'Only "Speaking JavaScript" should match "Speaking"').toEqual(['Speaking JavaScript']);
  });

  test('search should be case-insensitive', async () => {
    await bookStore.searchFor('speaking');
    const lowercaseTitles = await bookStore.getVisibleBookTitles();
    expect(lowercaseTitles, '"speaking" (lowercase) should match "Speaking JavaScript"').toContain('Speaking JavaScript');

    await bookStore.searchFor('ELOQUENT');
    const uppercaseTitles = await bookStore.getVisibleBookTitles();
    expect(uppercaseTitles, '"ELOQUENT" (uppercase) should match "Eloquent JavaScript, Second Edition"').toContain('Eloquent JavaScript, Second Edition');
  });
});
