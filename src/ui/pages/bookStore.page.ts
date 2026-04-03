import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class BookStorePage extends BasePage {
  private readonly searchBox: Locator;
  private readonly bookTable: Locator;
  private readonly bookRows: Locator;
  private readonly paginationLabel: Locator;
  private readonly previousButton: Locator;
  private readonly nextButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
    this.bookTable = page.getByRole('table');
    this.bookRows = page.locator('table tbody tr');
    this.paginationLabel = page.locator('.-pageInfo');
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async open() {
    await this.navigateTo('/books');
    await this.bookTable.locator('tbody tr').first().waitFor();
  }

  async searchFor(query: string) {
    await this.searchBox.fill(query);
  }

  async clearSearch() {
    await this.searchBox.fill('');
  }

  async getSearchValue(): Promise<string> {
    return await this.searchBox.inputValue();
  }

  async getVisibleBookTitles(): Promise<string[]> {
    const links = this.bookTable.locator('tbody td a');
    return await links.allTextContents();
  }

  async getVisibleBookCount(): Promise<number> {
    const titles = await this.getVisibleBookTitles();
    return titles.length;
  }

  async isBookVisible(title: string): Promise<boolean> {
    const titles = await this.getVisibleBookTitles();
    return titles.includes(title);
  }

  async hasNoResults(): Promise<boolean> {
    const count = await this.getVisibleBookCount();
    return count === 0;
  }

  async clickBook(title: string) {
    await this.bookTable.locator('tbody td a', { hasText: title }).click();
  }
}
