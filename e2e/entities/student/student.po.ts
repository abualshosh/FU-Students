import { element, by, browser, ElementFinder } from 'protractor';

export class StudentComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Students found.'));
  entities = element.all(by.css('page-student ion-item'));

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

export class StudentUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  indexInput = element(by.css('ion-input[formControlName="index"] input'));
  fullNameArabicInput = element(by.css('ion-input[formControlName="fullNameArabic"] input'));
  phoneInput = element(by.css('ion-input[formControlName="phone"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIndexInput(index: string): Promise<void> {
    await this.indexInput.sendKeys(index);
  }
  async setFullNameArabicInput(fullNameArabic: string): Promise<void> {
    await this.fullNameArabicInput.sendKeys(fullNameArabic);
  }
  async setPhoneInput(phone: string): Promise<void> {
    await this.phoneInput.sendKeys(phone);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class StudentDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  indexInput = element.all(by.css('span')).get(1);

  fullNameArabicInput = element.all(by.css('span')).get(2);

  phoneInput = element.all(by.css('span')).get(3);

  async getIndexInput(): Promise<string> {
    return await this.indexInput.getText();
  }

  async getFullNameArabicInput(): Promise<string> {
    return await this.fullNameArabicInput.getText();
  }

  async getPhoneInput(): Promise<string> {
    return await this.phoneInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
