import { element, by, browser, ElementFinder } from 'protractor';

export class AnnouncementComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Announcements found.'));
  entities = element.all(by.css('page-announcement ion-item'));

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

export class AnnouncementUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  contentInput = element(by.css('ion-textarea[formControlName="content"] textarea'));
  announcementTypeSelect = element(by.css('ion-select[formControlName="announcementType"]'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setContentInput(content: string): Promise<void> {
    await this.contentInput.sendKeys(content);
  }
  async announcementTypeSelectLastOption(): Promise<void> {
    await this.announcementTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class AnnouncementDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  titleInput = element.all(by.css('span')).get(1);

  contentInput = element.all(by.css('span')).get(2);

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getContentInput(): Promise<string> {
    return await this.contentInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
