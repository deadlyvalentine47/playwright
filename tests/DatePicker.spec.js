const { test, expect } = require("@playwright/test");
import {HomePage} from '../pages/homePage'
import {getTestData } from '../utils/dataProvider';


const tesdata = getTestData('testdata/datePicker.json')


tesdata.forEach((testcase) => {
    test('date picker 1', async ({page}) => {

        const hp = new HomePage(page, testcase)

        await hp.navigateToHomePage()
        await hp.login()

        await page.locator('#birthDate').click()
        
        const options = await page.$$('.react-datepicker__month-select option');

        for(const m of options) {
            const month = await m.textContent()
            console.log(month)
        }


    })

});


// test('date picker', async ({page}) => {
//     await page.goto('https://testautomationpractice.blogspot.com/')

//     //enter date manually
//     await page.locator('#datepicker').type('09/01/1999')
//     await page.keyboard.press('Enter')

//     await page.keyboard.press('Tab')

//     //enter date using picker

//     // await page.getByLabel('Select month').selectOption('5');
//     // await page.locator('#txtDate').selectOption('5');

//     // await page.getByLabel('Select year').selectOption('2016');
//     // await page.locator('#txtDate').selectOption('2016');

//     // await page.getByTitle('Next').click();

//     // await page.waitForTimeout(3000)
// })
