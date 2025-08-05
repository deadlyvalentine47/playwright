const {test, expect, chromium} = require('@playwright/test')


test('tab switch', async ({context}) => {
    const page = await context.newPage();

    await page.goto('https://code.visualstudio.com/')
    await expect(page).toHaveTitle('Visual Studio Code - Code Editing. Redefined')

    const promise = context.waitForEvent('page')
    await page.locator('#footer-privacy-link').click()

    const page1 = await promise
    await expect(page1).toHaveTitle('Microsoft Privacy Statement – Microsoft privacy')

})


test('tab switch 2', async ({}) => {
    const browser = await chromium.launch()

    const context = await browser.newContext()

    const page = await context.newPage()

    await page.goto('https://code.visualstudio.com/')
    await expect(page).toHaveTitle('Visual Studio Code - Code Editing. Redefined')

    const promise = context.waitForEvent('page')
    await page.locator('#footer-privacy-link').click()

    const page1 = await promise
    await expect(page1).toHaveTitle('Microsoft Privacy Statement – Microsoft privacy')

})


test('popup', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Collect popup windows
    const popups = [];
    context.on('page', popup => popups.push(popup));

    await page.getByRole("button", { name: "Popup Windows" }).click();

    // Wait enough time for popups to open
    await page.waitForTimeout(2000);

    if (popups.length !== 2) {
        throw new Error(`Expected 2 popups, but got ${popups.length}`);
    }

    await Promise.all(popups.map(p => p.waitForLoadState()));

    for (const popup of popups) {
        console.log('Popup URL:', popup.url());
    }

    const [popup1, popup2] = popups;

    const seleniumPopup = [popup1, popup2].find(p => p.url().includes('selenium.dev'));
    const playwrightPopup = [popup1, popup2].find(p => p.url().includes('playwright.dev'));

    if (!seleniumPopup || !playwrightPopup) {
        throw new Error('Could not correctly identify popups based on URL');
    }

    await expect(seleniumPopup).toHaveTitle('Selenium');
    await expect(playwrightPopup).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright');
});


test.only('asd', async ({context}) => {
    const page = await context.newPage();
    await page.goto('https://testautomationpractice.blogspot.com/');

    const popups = []
    context.on('page', p => popups.push(p))

    await page.getByRole("button", { name: "Popup Windows" }).click();

    await Promise.all(popups.map(p=>p.waitForLoadState()))

    for(const p of popups)
        console.log(await p.url())
})