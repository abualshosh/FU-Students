import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { BatchComponentsPage, BatchDetailPage, BatchUpdatePage } from './batch.po';

describe('Batch e2e test', () => {
  let loginPage: LoginPage;
  let batchComponentsPage: BatchComponentsPage;
  let batchUpdatePage: BatchUpdatePage;
  let batchDetailPage: BatchDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Batches';
  const SUBCOMPONENT_TITLE = 'Batch';
  let lastElement: any;
  let isVisible = false;

  const year = 'year';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);
  });

  it('should load Batches', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Batch')
      .first()
      .click();

    batchComponentsPage = new BatchComponentsPage();
    await browser.wait(ec.visibilityOf(batchComponentsPage.title), 5000);
    expect(await batchComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(batchComponentsPage.entities.get(0)), ec.visibilityOf(batchComponentsPage.noResult)), 5000);
  });

  it('should create Batch', async () => {
    initNumberOfEntities = await batchComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(batchComponentsPage.createButton), 5000);
    await batchComponentsPage.clickOnCreateButton();
    batchUpdatePage = new BatchUpdatePage();
    await browser.wait(ec.visibilityOf(batchUpdatePage.pageTitle), 1000);
    expect(await batchUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await batchUpdatePage.setYearInput(year);

    await batchUpdatePage.save();
    await browser.wait(ec.visibilityOf(batchComponentsPage.title), 1000);
    expect(await batchComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await batchComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Batch', async () => {
    batchComponentsPage = new BatchComponentsPage();
    await browser.wait(ec.visibilityOf(batchComponentsPage.title), 5000);
    lastElement = await batchComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Batch', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Batch', async () => {
    batchDetailPage = new BatchDetailPage();
    if (isVisible && (await batchDetailPage.pageTitle.isDisplayed())) {
      expect(await batchDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await batchDetailPage.getYearInput()).toEqual(year);
    }
  });

  it('should delete last Batch', async () => {
    batchDetailPage = new BatchDetailPage();
    if (isVisible && (await batchDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await batchDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(batchComponentsPage.title), 3000);
      expect(await batchComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await batchComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Batches tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
