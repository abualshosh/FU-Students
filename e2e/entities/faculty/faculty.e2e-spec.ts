import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FacultyComponentsPage, FacultyDetailPage, FacultyUpdatePage } from './faculty.po';

describe('Faculty e2e test', () => {
  let loginPage: LoginPage;
  let facultyComponentsPage: FacultyComponentsPage;
  let facultyUpdatePage: FacultyUpdatePage;
  let facultyDetailPage: FacultyDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Faculties';
  const SUBCOMPONENT_TITLE = 'Faculty';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const code = 'code';

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

  it('should load Faculties', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Faculty')
      .first()
      .click();

    facultyComponentsPage = new FacultyComponentsPage();
    await browser.wait(ec.visibilityOf(facultyComponentsPage.title), 5000);
    expect(await facultyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(facultyComponentsPage.entities.get(0)), ec.visibilityOf(facultyComponentsPage.noResult)),
      5000
    );
  });

  it('should create Faculty', async () => {
    initNumberOfEntities = await facultyComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(facultyComponentsPage.createButton), 5000);
    await facultyComponentsPage.clickOnCreateButton();
    facultyUpdatePage = new FacultyUpdatePage();
    await browser.wait(ec.visibilityOf(facultyUpdatePage.pageTitle), 1000);
    expect(await facultyUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await facultyUpdatePage.setNameInput(name);
    await facultyUpdatePage.setCodeInput(code);

    await facultyUpdatePage.save();
    await browser.wait(ec.visibilityOf(facultyComponentsPage.title), 1000);
    expect(await facultyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await facultyComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Faculty', async () => {
    facultyComponentsPage = new FacultyComponentsPage();
    await browser.wait(ec.visibilityOf(facultyComponentsPage.title), 5000);
    lastElement = await facultyComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Faculty', async () => {
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

  it('should view the last Faculty', async () => {
    facultyDetailPage = new FacultyDetailPage();
    if (isVisible && (await facultyDetailPage.pageTitle.isDisplayed())) {
      expect(await facultyDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await facultyDetailPage.getNameInput()).toEqual(name);

      expect(await facultyDetailPage.getCodeInput()).toEqual(code);
    }
  });

  it('should delete last Faculty', async () => {
    facultyDetailPage = new FacultyDetailPage();
    if (isVisible && (await facultyDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await facultyDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(facultyComponentsPage.title), 3000);
      expect(await facultyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await facultyComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Faculties tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
