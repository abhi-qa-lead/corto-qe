import { test as base } from '@playwright/test';
import { BookStorePage } from '@ui/pages/bookStore.page';

type UiFixtures = {
  bookStorePage: BookStorePage;
};

export const test = base.extend<UiFixtures>({
  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);
    await bookStorePage.open();
    await use(bookStorePage);
  },
});

export { expect } from '@playwright/test';
