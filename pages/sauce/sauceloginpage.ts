import type { Locator, Page } from '@playwright/test';
import {SauceLoginModel} from '../../types/sauce.js'

export class SauceLoginPage {
    userName: Locator
    password: Locator
    loginButton: Locator
    page: Page
    

    constructor (page: Page) {
        this.page = page
        this.loginButton =  page.locator('#login-button')
        this.userName = page.locator('#user-name')
        this.password = page.locator('#password')
    }

    async navigateToSauceLoginpage () {
        await this.page.goto("/", {waitUntil : 'domcontentloaded'})
    }

    async login (testcase : SauceLoginModel) {
        await this.userName.pressSequentially(testcase.loginCredentials.userName, { delay: 100 });
        await this.password.fill(testcase.loginCredentials.password)
    
        await this.loginButton.click()

    }
}