import { element, by, browser, ElementFinder } from 'protractor';

export class ProjectComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Projects found.'));
  entities = element.all(by.css('page-project ion-item'));

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

export class ProjectUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  detailsInput = element(by.css('ion-textarea[formControlName="details"] textarea'));
  objectivesInput = element(by.css('ion-textarea[formControlName="objectives"] textarea'));
  problemsInput = element(by.css('ion-textarea[formControlName="problems"] textarea'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setDetailsInput(details: string): Promise<void> {
    await this.detailsInput.sendKeys(details);
  }
  async setObjectivesInput(objectives: string): Promise<void> {
    await this.objectivesInput.sendKeys(objectives);
  }
  async setProblemsInput(problems: string): Promise<void> {
    await this.problemsInput.sendKeys(problems);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ProjectDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  nameInput = element.all(by.css('span')).get(1);

  detailsInput = element.all(by.css('span')).get(2);

  objectivesInput = element.all(by.css('span')).get(3);

  problemsInput = element.all(by.css('span')).get(4);

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getDetailsInput(): Promise<string> {
    return await this.detailsInput.getText();
  }

  async getObjectivesInput(): Promise<string> {
    return await this.objectivesInput.getText();
  }

  async getProblemsInput(): Promise<string> {
    return await this.problemsInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
