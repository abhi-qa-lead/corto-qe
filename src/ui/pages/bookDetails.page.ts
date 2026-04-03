import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class BookDetailsPage extends BasePage {
  private readonly backToStoreButton: Locator;
  private readonly detailsWrapper: Locator;

  constructor(page: Page) {
    super(page);
    this.backToStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
    this.detailsWrapper = page.locator('#title-wrapper');
  }

  async waitForDetails() {
    await this.detailsWrapper.waitFor();
  }

  async getField(label: string): Promise<string> {
    const row = this.page.locator(`#${label}-wrapper`);
    return await row.locator('#userName-value').innerText();
  }

  get heading() {
    return this.page.getByRole('heading', { name: 'Book Store' });
  }

  async getISBN(): Promise<string> {
    return this.getField('ISBN');
  }

  async getTitle(): Promise<string> {
    return this.getField('title');
  }

  async getSubTitle(): Promise<string> {
    return this.getField('subtitle');
  }

  async getAuthor(): Promise<string> {
    return this.getField('author');
  }

  async getPublisher(): Promise<string> {
    return this.getField('publisher');
  }

  async getTotalPages(): Promise<string> {
    return this.getField('pages');
  }

  async getDescription(): Promise<string> {
    return this.getField('description');
  }

  async getWebsiteLink(): Promise<string> {
    const value = await this.getField('website');
    return value;
  }

  async goBackToStore() {
    await this.backToStoreButton.click();
  }
}
