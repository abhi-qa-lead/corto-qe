import { test, expect } from '@fixtures';
import { BOOKS, getRandomBooks } from '@ui/data/books';

test.describe('COR-2: Click book title navigates to book details page', () => {
  test('should display all details for a book', async ({
    page,
    bookStorePage,
    bookDetailsPage,
  }) => {
    const book = getRandomBooks(1)[0];
    await bookStorePage.clickBook(book.title);
    await bookDetailsPage.waitForDetails();

    await expect(page).toHaveURL(new RegExp(`books\\?search=${book.isbn}`));
    await expect(page).toHaveURL(/books\?search=/);
    expect(page.url()).toContain(book.isbn);

    await expect(bookDetailsPage.pageHeading, 'Page heading should be visible').toBeVisible();
    expect(await bookDetailsPage.getISBN(), `ISBN should match - ${book.isbn}`).toBe(book.isbn);
    expect(await bookDetailsPage.getTitle(), `Title should match - ${book.title}`).toBe(book.title);
    expect(await bookDetailsPage.getSubTitle(), `Sub Title should match - ${book.subTitle}`).toBe(
      book.subTitle,
    );
    expect(await bookDetailsPage.getAuthor(), `Author should match - ${book.author}`).toBe(
      book.author,
    );
    expect(await bookDetailsPage.getPublisher(), `Publisher should match - ${book.publisher}`).toBe(
      book.publisher,
    );
    expect(await bookDetailsPage.getTotalPages(), `Total Pages should match - ${book.pages}`).toBe(
      String(book.pages),
    );
    expect(
      await bookDetailsPage.getDescription().then((text) => text.length),
      `Description should not be empty`,
    ).toBeGreaterThan(0);
    expect(await bookDetailsPage.getWebsiteLink(), `Website should match - ${book.website}`).toBe(
      book.website,
    );
  });

  test('should navigate back to book store from details page', async ({
    page,
    bookStorePage,
    bookDetailsPage,
  }) => {
    await bookStorePage.clickBook(BOOKS[0].title);
    await bookDetailsPage.waitForDetails();

    await bookDetailsPage.goBackToStore();
    expect(new URL(page.url()).pathname).toBe('/books');
  });
});
