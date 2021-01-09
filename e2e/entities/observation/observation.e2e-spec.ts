import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ObservationComponentsPage, ObservationDetailPage, ObservationUpdatePage } from './observation.po';

describe('Observation e2e test', () => {
  let loginPage: LoginPage;
  let observationComponentsPage: ObservationComponentsPage;
  let observationUpdatePage: ObservationUpdatePage;
  let observationDetailPage: ObservationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Observations';
  const SUBCOMPONENT_TITLE = 'Observation';
  let lastElement: any;
  let isVisible = false;

  const title = 'title';
  const detail = 'detail';

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

  it('should load Observations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Observation')
      .first()
      .click();

    observationComponentsPage = new ObservationComponentsPage();
    await browser.wait(ec.visibilityOf(observationComponentsPage.title), 5000);
    expect(await observationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(observationComponentsPage.entities.get(0)), ec.visibilityOf(observationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Observation', async () => {
    initNumberOfEntities = await observationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(observationComponentsPage.createButton), 5000);
    await observationComponentsPage.clickOnCreateButton();
    observationUpdatePage = new ObservationUpdatePage();
    await browser.wait(ec.visibilityOf(observationUpdatePage.pageTitle), 1000);
    expect(await observationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await observationUpdatePage.setTitleInput(title);
    await observationUpdatePage.setDetailInput(detail);

    await observationUpdatePage.save();
    await browser.wait(ec.visibilityOf(observationComponentsPage.title), 1000);
    expect(await observationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await observationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Observation', async () => {
    observationComponentsPage = new ObservationComponentsPage();
    await browser.wait(ec.visibilityOf(observationComponentsPage.title), 5000);
    lastElement = await observationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Observation', async () => {
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

  it('should view the last Observation', async () => {
    observationDetailPage = new ObservationDetailPage();
    if (isVisible && (await observationDetailPage.pageTitle.isDisplayed())) {
      expect(await observationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await observationDetailPage.getTitleInput()).toEqual(title);

      expect(await observationDetailPage.getDetailInput()).toEqual(detail);
    }
  });

  it('should delete last Observation', async () => {
    observationDetailPage = new ObservationDetailPage();
    if (isVisible && (await observationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await observationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(observationComponentsPage.title), 3000);
      expect(await observationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await observationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Observations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
