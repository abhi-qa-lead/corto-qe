import { test, expect } from '@fixtures';
import { BOOKS, getRandomBooks } from '@ui/data/books';

function getBooksMatchingSearch(query: string) {
  const q = query.toLowerCase();
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.publisher.toLowerCase().includes(q),
  ).map((b) => b.title);
}

test.describe('COR-4: Search filters books by author name', () => {
  test('should filter books when searching by full author name', async ({ bookStorePage }) => {
    const book = getRandomBooks(1)[0];
    await bookStorePage.searchFor(book.author);

    const titles = await bookStorePage.getVisibleBookTitles();
    const expectedTitles = getBooksMatchingSearch(book.author);

    expect(titles.sort(), `Searching "${book.author}" should show matching books`).toEqual(
      expectedTitles.sort(),
    );
  });

  test('should filter books when searching by partial author name', async ({ bookStorePage }) => {
    const book = getRandomBooks(1)[0];
    const partialName = book.author.substring(0, Math.ceil(book.author.length / 2));
    await bookStorePage.searchFor(partialName);

    const titles = await bookStorePage.getVisibleBookTitles();
    const expectedTitles = getBooksMatchingSearch(partialName);

    expect(
      titles.length,
      `Partial author name "${partialName}" should return results`,
    ).toBeGreaterThan(0);
    expect(titles.sort(), `All books matching "${partialName}" should appear`).toEqual(
      expectedTitles.sort(),
    );
  });

  test('should show no results for non-existent author', async ({ bookStorePage }) => {
    await bookStorePage.searchFor('NonExistentAuthor');

    const hasNoResults = await bookStorePage.hasNoResults();
    expect(hasNoResults, 'Table should be empty for non-existent author').toBe(true);
  });
});
