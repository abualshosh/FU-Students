import { element, by, browser, ElementFinder } from 'protractor';

export class BatchComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Batches found.'));
  entities = element.all(by.css('page-batch ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class BatchUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  yearInput = element(by.css('ion-input[formControlName="year"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setYearInput(year: string): Promise<void> {
    await this.yearInput.sendKeys(year);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class BatchDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  yearInput = element.all(by.css('span')).get(1);

  async getYearInput(): Promise<string> {
    return await this.yearInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
