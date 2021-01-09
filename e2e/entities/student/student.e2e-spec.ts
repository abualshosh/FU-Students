import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { StudentComponentsPage, StudentDetailPage, StudentUpdatePage } from './student.po';

describe('Student e2e test', () => {
  let loginPage: LoginPage;
  let studentComponentsPage: StudentComponentsPage;
  let studentUpdatePage: StudentUpdatePage;
  let studentDetailPage: StudentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Students';
  const SUBCOMPONENT_TITLE = 'Student';
  let lastElement: any;
  let isVisible = false;

  const index = 'index';
  const fullNameArabic = 'fullNameArabic';
  const phone = 'phone';

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

  it('should load Students', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Student')
      .first()
      .click();

    studentComponentsPage = new StudentComponentsPage();
    await browser.wait(ec.visibilityOf(studentComponentsPage.title), 5000);
    expect(await studentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(studentComponentsPage.entities.get(0)), ec.visibilityOf(studentComponentsPage.noResult)),
      5000
    );
  });

  it('should create Student', async () => {
    initNumberOfEntities = await studentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(studentComponentsPage.createButton), 5000);
    await studentComponentsPage.clickOnCreateButton();
    studentUpdatePage = new StudentUpdatePage();
    await browser.wait(ec.visibilityOf(studentUpdatePage.pageTitle), 1000);
    expect(await studentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await studentUpdatePage.setIndexInput(index);
    await studentUpdatePage.setFullNameArabicInput(fullNameArabic);
    await studentUpdatePage.setPhoneInput(phone);

    await studentUpdatePage.save();
    await browser.wait(ec.visibilityOf(studentComponentsPage.title), 1000);
    expect(await studentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await studentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Student', async () => {
    studentComponentsPage = new StudentComponentsPage();
    await browser.wait(ec.visibilityOf(studentComponentsPage.title), 5000);
    lastElement = await studentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Student', async () => {
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

  it('should view the last Student', async () => {
    studentDetailPage = new StudentDetailPage();
    if (isVisible && (await studentDetailPage.pageTitle.isDisplayed())) {
      expect(await studentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await studentDetailPage.getIndexInput()).toEqual(index);

      expect(await studentDetailPage.getFullNameArabicInput()).toEqual(fullNameArabic);

      expect(await studentDetailPage.getPhoneInput()).toEqual(phone);
    }
  });

  it('should delete last Student', async () => {
    studentDetailPage = new StudentDetailPage();
    if (isVisible && (await studentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await studentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(studentComponentsPage.title), 3000);
      expect(await studentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await studentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Students tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
