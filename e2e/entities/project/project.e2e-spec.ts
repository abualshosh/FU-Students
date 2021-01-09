import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProjectComponentsPage, ProjectDetailPage, ProjectUpdatePage } from './project.po';

describe('Project e2e test', () => {
  let loginPage: LoginPage;
  let projectComponentsPage: ProjectComponentsPage;
  let projectUpdatePage: ProjectUpdatePage;
  let projectDetailPage: ProjectDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Projects';
  const SUBCOMPONENT_TITLE = 'Project';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const details = 'details';
  const objectives = 'objectives';
  const problems = 'problems';

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

  it('should load Projects', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Project')
      .first()
      .click();

    projectComponentsPage = new ProjectComponentsPage();
    await browser.wait(ec.visibilityOf(projectComponentsPage.title), 5000);
    expect(await projectComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(projectComponentsPage.entities.get(0)), ec.visibilityOf(projectComponentsPage.noResult)),
      5000
    );
  });

  it('should create Project', async () => {
    initNumberOfEntities = await projectComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(projectComponentsPage.createButton), 5000);
    await projectComponentsPage.clickOnCreateButton();
    projectUpdatePage = new ProjectUpdatePage();
    await browser.wait(ec.visibilityOf(projectUpdatePage.pageTitle), 1000);
    expect(await projectUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await projectUpdatePage.setNameInput(name);
    await projectUpdatePage.setDetailsInput(details);
    await projectUpdatePage.setObjectivesInput(objectives);
    await projectUpdatePage.setProblemsInput(problems);

    await projectUpdatePage.save();
    await browser.wait(ec.visibilityOf(projectComponentsPage.title), 1000);
    expect(await projectComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await projectComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Project', async () => {
    projectComponentsPage = new ProjectComponentsPage();
    await browser.wait(ec.visibilityOf(projectComponentsPage.title), 5000);
    lastElement = await projectComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Project', async () => {
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

  it('should view the last Project', async () => {
    projectDetailPage = new ProjectDetailPage();
    if (isVisible && (await projectDetailPage.pageTitle.isDisplayed())) {
      expect(await projectDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await projectDetailPage.getNameInput()).toEqual(name);

      expect(await projectDetailPage.getDetailsInput()).toEqual(details);

      expect(await projectDetailPage.getObjectivesInput()).toEqual(objectives);

      expect(await projectDetailPage.getProblemsInput()).toEqual(problems);
    }
  });

  it('should delete last Project', async () => {
    projectDetailPage = new ProjectDetailPage();
    if (isVisible && (await projectDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await projectDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(projectComponentsPage.title), 3000);
      expect(await projectComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await projectComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Projects tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
