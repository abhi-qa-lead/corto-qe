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

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const book = BOOKS[i];
      expect(row.title, `Row ${i + 1} title should match - ${book.title}`).toBe(book.title);
      expect(row.author, `Row ${i + 1} author should match - ${book.author}`).toBe(book.author);
      expect(row.publisher, `Row ${i + 1} publisher should match - ${book.publisher}`).toBe(
        book.publisher,
      );
    }
  });
});
