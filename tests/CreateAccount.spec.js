const { test, expect } = require('@playwright/test');
import {getTestData } from '../utils/dataProvider';

import {HomePage} from '../pages/homePage'
import {CreateAccount} from '../pages/createAccountPage'

const testData = getTestData('testdata/e2eTestData.json');

testData.forEach((testcase) => {
    test(`${testcase.testName}`, async ({page}) => {

        const homepage = new HomePage(page)
        const createAccountForm = new CreateAccount(page, testcase)

        await homepage.navigateToHomePage()
        await homepage.signUp()

        await createAccountForm.fillform()

        //we can add a delete function to delete data of user from db so the testcase will run for same data
    })
});