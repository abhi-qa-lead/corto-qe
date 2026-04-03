import { test as base } from '@playwright/test';
import { BookStorePage } from '@ui/pages/bookStore.page';
import { BookDetailsPage } from '@ui/pages/bookDetails.page';

type UiFixtures = {
  bookStorePage: BookStorePage;
  bookDetailsPage: BookDetailsPage;
};

export const test = base.extend<UiFixtures>({
  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);
    await bookStorePage.open();
    await use(bookStorePage);
  },
  bookDetailsPage: async ({ page }, use) => {
    const bookDetailsPage = new BookDetailsPage(page);
    await use(bookDetailsPage);
  },
});

export { expect } from '@playwright/test';
