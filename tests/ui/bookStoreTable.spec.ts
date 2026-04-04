import { test, expect } from '@fixtures';
import { BOOKS, BOOKS_COLUMN_HEADERS } from '@ui/data/books';

test.describe('COR-3: Each book row displays correct title, author, publisher etc', () => {
  test('should display correct column headers', async ({ bookStorePage }) => {
    const headers = await bookStorePage.getColumnHeaders();
    expect(headers, `Expected column headers to match`).toEqual(BOOKS_COLUMN_HEADERS);
  });

  test('should display correct data in each row of the book table', async ({ bookStorePage }) => {
    const rows = await bookStorePage.getAllBookRowData();

    expect(rows.length, 'Table should have the same number of rows as books in data').toBe(
      BOOKS.length,
    );

    const expectedByTitle = new Map(BOOKS.map((book) => [book.title, book]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const expected = expectedByTitle.get(row.title);

      expect(expected, `Row ${i + 1} has unexpected title - ${row.title}`).toBeDefined();
      expect(row.author, `Row ${i + 1} author should match - ${row.title}`).toBe(expected!.author);
      expect(row.publisher, `Row ${i + 1} publisher should match - ${row.title}`).toBe(
        expected!.publisher,
      );
    }
  });
});
