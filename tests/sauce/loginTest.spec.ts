import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';

import {SauceLoginModel} from '../../types/sauce.js'
import {SauceLoginPage} from '../../pages/sauce/sauceloginpage.js'

const testCases = getTestData<SauceLoginModel>('testdata/sauce/loginTests.json');

test.describe('Sauce Login Tests', () => {

    for(const testcase of testCases) {
        
        test(testcase.commonTestData.testName, async ({page}) => {
            
            const loginPage = new SauceLoginPage(page)

            await loginPage.navigateToSauceLoginpage()
            await loginPage.login(testcase)

           if (testcase.validations.expectedUrl) {
            await expect(page).toHaveURL(new RegExp(testcase.validations.expectedUrl))
           }

           if (testcase.validations.expectedError) {
            await expect(page.locator('[data-test="error"]')).toContainText(testcase.validations.expectedError)
           }

        })

    }
})