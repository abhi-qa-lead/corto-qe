import { test, expect } from '@fixtures';
import { BOOKS, TOTAL_BOOKS } from '@ui/data/books';

test.describe('COR-1: Search filters books by book title', () => {
  test('should display all books when search box is empty', async ({ bookStorePage }) => {
    const count = await bookStorePage.getVisibleBookCount();
    expect(count, `Expected all ${TOTAL_BOOKS} books to be visible`).toBe(TOTAL_BOOKS);
  });

  test('should filter books by exact title keyword', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('Git');

    const titles = await bookStorePage.getVisibleBookTitles();
    expect(titles, 'Only "Git Pocket Guide" should match "Git"').toEqual(['Git Pocket Guide']);
  });

  test('should filter books by partial title keyword', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('JavaScript');

    const titles = await bookStorePage.getVisibleBookTitles();
    const expectedTitles = BOOKS.filter((b) => b.title.includes('JavaScript')).map((b) => b.title);

    expect(titles.length, 'Multiple books should match "JavaScript"').toBeGreaterThan(1);
    expect(titles.sort(), 'All books with "JavaScript" in title should appear').toEqual(
      expectedTitles.sort(),
    );
  });

  test('should show no results for non-matching keyword', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('NonExistentBookTitle');

    const hasNoResults = await bookStorePage.hasNoResults();
    expect(hasNoResults, 'Table should be empty for non-matching search').toBe(true);
  });

  test('should restore all books when search is cleared', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('Git');
    const filteredCount = await bookStorePage.getVisibleBookCount();
    expect(filteredCount, 'Should have filtered results').toBeLessThan(TOTAL_BOOKS);

    await bookStorePage.clearSearch();
    const restoredCount = await bookStorePage.getVisibleBookCount();
    expect(restoredCount, 'All books should be restored after clearing search').toBe(TOTAL_BOOKS);
  });

  test('should filter results as user types incrementally', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('Sp');
    const afterSp = await bookStorePage.getVisibleBookTitles();
    expect(afterSp, '"Speaking JavaScript" should match "Sp"').toContain('Speaking JavaScript');

    await bookStorePage.searchFor('Speaking');
    const afterFull = await bookStorePage.getVisibleBookTitles();
    expect(afterFull, 'Only "Speaking JavaScript" should match "Speaking"').toEqual([
      'Speaking JavaScript',
    ]);
  });

  test('search should be case-insensitive', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('speaking');
    const lowercaseTitles = await bookStorePage.getVisibleBookTitles();
    expect(lowercaseTitles, '"speaking" (lowercase) should match "Speaking JavaScript"').toContain(
      'Speaking JavaScript',
    );

    await bookStorePage.searchFor('ELOQUENT');
    const uppercaseTitles = await bookStorePage.getVisibleBookTitles();
    expect(
      uppercaseTitles,
      '"ELOQUENT" (uppercase) should match "Eloquent JavaScript, Second Edition"',
    ).toContain('Eloquent JavaScript, Second Edition');
  });
});
