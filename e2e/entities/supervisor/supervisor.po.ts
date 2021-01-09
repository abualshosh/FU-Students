import { element, by, browser, ElementFinder } from 'protractor';

export class SupervisorComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Supervisors found.'));
  entities = element.all(by.css('page-supervisor ion-item'));

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

export class SupervisorUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  fullNameInput = element(by.css('ion-input[formControlName="fullName"] input'));
  roleInput = element(by.css('ion-input[formControlName="role"] input'));
  genderSelect = element(by.css('ion-select[formControlName="gender"]'));
  emailInput = element(by.css('ion-input[formControlName="email"] input'));
  phoneNumberInput = element(by.css('ion-input[formControlName="phoneNumber"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setFullNameInput(fullName: string): Promise<void> {
    await this.fullNameInput.sendKeys(fullName);
  }
  async setRoleInput(role: string): Promise<void> {
    await this.roleInput.sendKeys(role);
  }
  async genderSelectLastOption(): Promise<void> {
    await this.genderSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }
  async setPhoneNumberInput(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.sendKeys(phoneNumber);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class SupervisorDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  fullNameInput = element.all(by.css('span')).get(1);

  roleInput = element.all(by.css('span')).get(2);

  emailInput = element.all(by.css('span')).get(4);

  phoneNumberInput = element.all(by.css('span')).get(5);

  async getFullNameInput(): Promise<string> {
    return await this.fullNameInput.getText();
  }

  async getRoleInput(): Promise<string> {
    return await this.roleInput.getText();
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getText();
  }

  async getPhoneNumberInput(): Promise<string> {
    return await this.phoneNumberInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
