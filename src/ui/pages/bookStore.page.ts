import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class BookStorePage extends BasePage {
  private readonly searchBox: Locator;
  private readonly bookTable: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
    this.bookTable = page.getByRole('table');
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

  async getColumnHeaders(): Promise<string[]> {
    const headers = this.bookTable.locator('thead th');
    return (await headers.allTextContents()).map((h) => h.trim());
  }

  async getBookRowData(row: Locator) {
    const cells = row.locator('td');
    const getCellText = async (index: number) =>
      ((await cells.nth(index).textContent()) ?? '').trim();
    return {
      title: await getCellText(1),
      author: await getCellText(2),
      publisher: await getCellText(3),
    };
  }

  async getAllBookRowData() {
    const rows = this.bookTable.locator('tbody tr');
    const count = await rows.count();
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(await this.getBookRowData(rows.nth(i)));
    }
    return data;
  }

  async clickBook(title: string): Promise<void> {
    await this.bookTable.getByRole('link', { name: title, exact: true }).click();
  }
}
