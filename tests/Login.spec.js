const {expect, test} = require('@playwright/test');

import {getTestData } from '../utils/dataProvider';
import {HomePage} from '../pages/homePage'

const testData = getTestData("testdata/login.json")

for(const testcase of testData) {
    test(`${testcase.testName}`, async ({page}) => {

        const homePage = new HomePage(page, testcase)

        await homePage.navigateToHomePage()
        await homePage.login()
    })
}

