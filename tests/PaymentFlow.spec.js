const {test, expect} = require('@playwright/test')

import {getTestData } from '../utils/dataProvider';
import {HomePage} from '../pages/homePage';

const testData = getTestData('testdata/PaymentFlow.json')


for(const testcase of testData) {
    test(`${testcase.testName}`, async ({page}) => {

        const homepage = new HomePage(page, testcase)

        await homepage.navigateToHomePage()
        await homepage.login()

        await page.getByRole('row', { name: 'view KJ1-T94-26Y-23O copy-to-' }).getByTestId('icon-button').click({force:true});
        await page.getByRole('link', { name: 'Details' }).click();
        await page.getByTestId('adjust-commission-splits').click();


        let nameCount = 0
        const names = await page.$$('.border.border-regent-300.rounded-lg ul section .flex.items-center.space-x-2 p')
        for(const name of names) {
            nameCount++
            console.log(await name.textContent())
        }


        for (let i=0; i<nameCount; i++) {
            const currencySwitch = await page.$$('.border.border-regent-300.rounded-lg ul section button')

            // [id="commissionParticipant[[ + ${i} + ].money.amount

            const amountInput = page.locator('[id="commissionParticipant[i].money.amount"]')
            const percentInput = page.getByTestId('commissionParticipant[i].percent.value')

            
            if(testcase.toggle){
                await currencySwitch[i].click()
                await percentInput.click();
                await percentInput.press('ControlOrMeta+a');
                await percentInput.fill(testData.percent[i]);
            } else {
                await amountInput.click();
                await amountInput.press('ControlOrMeta+a');
                await amountInput.fill(testData.amount[i]);
            }    

        }
    

        await page.getByRole('button', { name: 'Save' }).click();
        
    
        await page.waitForTimeout(3000)
    })
}