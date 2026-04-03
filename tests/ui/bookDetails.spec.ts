import { test, expect } from '@fixtures';
import { BOOKS, getSampleBooks } from '@ui/data/books';

const SAMPLE_BOOKS = getSampleBooks(2);

test.describe('COR-2: Click book title navigates to book details page', () => {
  for (const book of SAMPLE_BOOKS) {
    test(`should display all details for "${book.title}"`, async ({
      page,
      bookStorePage,
      bookDetailsPage,
    }) => {
      await bookStorePage.clickBook(book.title);
      await bookDetailsPage.waitForDetails();

      await expect(page).toHaveURL(new RegExp(`books\\?search=${book.isbn}`));

      expect(await bookDetailsPage.getISBN(), 'ISBN should match').toBe(book.isbn);
      expect(await bookDetailsPage.getTitle(), 'Title should match').toBe(book.title);
      expect(await bookDetailsPage.getSubTitle(), 'Sub Title should match').toBe(book.subTitle);
      expect(await bookDetailsPage.getAuthor(), 'Author should match').toBe(book.author);
      expect(await bookDetailsPage.getPublisher(), 'Publisher should match').toBe(book.publisher);
      expect(await bookDetailsPage.getTotalPages(), 'Total Pages should match').toBe(
        String(book.pages),
      );
      expect(
        await bookDetailsPage.getDescription().then((text) => text.length),
        'Description should not be empty',
      ).toBeGreaterThan(0);
      expect(await bookDetailsPage.getWebsiteLink(), 'Website should match').toBe(book.website);
    });
  }

  test('should navigate back to book store from details page', async ({
    page,
    bookStorePage,
    bookDetailsPage,
  }) => {
    await bookStorePage.clickBook(BOOKS[0].title);
    await bookDetailsPage.waitForDetails();

    await bookDetailsPage.goBackToStore();
    await expect(page).toHaveURL(`${test.info().project.use.baseURL}/books`);
  });
});
