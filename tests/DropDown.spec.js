const { test, expect } = require("@playwright/test");
require("dotenv").config();

test('dropdown', async ({page}) => {
    await page.goto(process.env.BOLT_URL);

    await page.getByRole("link", { name: "Join Real" }).click();

    await page.locator('.mantine-Select-input').click()

    const options = await page.$$('//div[@role="option"]')
    for(const o of options){
        console.log(await o.textContent())
        const option = await o.textContent()
        if(option === "Canada")
            await o.click()
    }
})