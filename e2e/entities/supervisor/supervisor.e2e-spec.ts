import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { SupervisorComponentsPage, SupervisorDetailPage, SupervisorUpdatePage } from './supervisor.po';

describe('Supervisor e2e test', () => {
  let loginPage: LoginPage;
  let supervisorComponentsPage: SupervisorComponentsPage;
  let supervisorUpdatePage: SupervisorUpdatePage;
  let supervisorDetailPage: SupervisorDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Supervisors';
  const SUBCOMPONENT_TITLE = 'Supervisor';
  let lastElement: any;
  let isVisible = false;

  const fullName = 'fullName';
  const role = 'role';
  const email = 'email';
  const phoneNumber = 'phoneNumber';

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

  it('should load Supervisors', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Supervisor')
      .first()
      .click();

    supervisorComponentsPage = new SupervisorComponentsPage();
    await browser.wait(ec.visibilityOf(supervisorComponentsPage.title), 5000);
    expect(await supervisorComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(supervisorComponentsPage.entities.get(0)), ec.visibilityOf(supervisorComponentsPage.noResult)),
      5000
    );
  });

  it('should create Supervisor', async () => {
    initNumberOfEntities = await supervisorComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(supervisorComponentsPage.createButton), 5000);
    await supervisorComponentsPage.clickOnCreateButton();
    supervisorUpdatePage = new SupervisorUpdatePage();
    await browser.wait(ec.visibilityOf(supervisorUpdatePage.pageTitle), 1000);
    expect(await supervisorUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await supervisorUpdatePage.setFullNameInput(fullName);
    await supervisorUpdatePage.setRoleInput(role);
    await supervisorUpdatePage.genderSelectLastOption();
    await supervisorUpdatePage.setEmailInput(email);
    await supervisorUpdatePage.setPhoneNumberInput(phoneNumber);

    await supervisorUpdatePage.save();
    await browser.wait(ec.visibilityOf(supervisorComponentsPage.title), 1000);
    expect(await supervisorComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await supervisorComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Supervisor', async () => {
    supervisorComponentsPage = new SupervisorComponentsPage();
    await browser.wait(ec.visibilityOf(supervisorComponentsPage.title), 5000);
    lastElement = await supervisorComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Supervisor', async () => {
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

  it('should view the last Supervisor', async () => {
    supervisorDetailPage = new SupervisorDetailPage();
    if (isVisible && (await supervisorDetailPage.pageTitle.isDisplayed())) {
      expect(await supervisorDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await supervisorDetailPage.getFullNameInput()).toEqual(fullName);

      expect(await supervisorDetailPage.getRoleInput()).toEqual(role);

      expect(await supervisorDetailPage.getEmailInput()).toEqual(email);

      expect(await supervisorDetailPage.getPhoneNumberInput()).toEqual(phoneNumber);
    }
  });

  it('should delete last Supervisor', async () => {
    supervisorDetailPage = new SupervisorDetailPage();
    if (isVisible && (await supervisorDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await supervisorDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(supervisorComponentsPage.title), 3000);
      expect(await supervisorComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await supervisorComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Supervisors tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
