const {expect, test} = require('@playwright/test');


test('pagination', async ({page}) => {
    await page.goto("https://testautomationpractice.blogspot.com/");

    const table = await page.locator('#productTable')

    const columns = table.locator('thead th')
    console.log(await columns.count())

    const rows = table.locator('tbody tr')
    console.log(await rows.count())

    const matchedRow = rows.filter({
        has: page.locator('td'),
        hasText: 'Smartphone'
    })

    matchedRow.locator('input').click()

    await page.waitForTimeout(3000)

    for(let i =0; i<await rows.count(); i++) {
        const row = rows.nth(i)
        const tds = row.locator('td')

        for(let j=0; j<await columns.count()-1; j++) {
            console.log(await tds.nth(j).textContent())
        }
    }


    const paginationPages = page.locator('#pagination li a')
    for(let p=1; p< await paginationPages.count(); p++) {
        await paginationPages.nth(p).click()
    }

    await page.waitForTimeout(3000)

})