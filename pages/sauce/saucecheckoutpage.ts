import type { Locator, Page, } from '@playwright/test';
import { expect } from '@playwright/test';
import {CartPageModel} from '../../types/sauce.js'

export class SauceCheckoutPage {
    page: Page
    checkoutButton : Locator
    firstname: Locator
    lastName : Locator
    postalCode : Locator
    continueCheckout : Locator
    placeorder : Locator
    downloadOrderReceit : Locator
    orderSuccess : Locator

    constructor (page:Page) {
        this.page = page
        this.checkoutButton = page.locator('[data-test="checkout"]')
        this.firstname = page.locator('[data-test="firstName"]')
        this.lastName = page.locator('[data-test="lastName"]')
        this.postalCode = page.locator('[data-test="postalCode"]')
        this.continueCheckout = page.locator('[data-test="continue"]')
        this.placeorder = page.locator('[data-test="finish"]')
        this.downloadOrderReceit = page.locator('[data-test="generate-pdf-order"]')
        this.orderSuccess = page.locator('[data-test="complete-header"]')
    }

    async checkout (testcase: CartPageModel) {
        await this.checkoutButton.click();

        await this.firstname.fill(testcase.firstname);
        await this.lastName.fill(testcase.lastName);
        await this.postalCode.fill(`${testcase.postalCode}`);
        await this.continueCheckout.click();

        await this.placeorder.click();
    }


    async VerifyorderAndNavigateToHomePage () {

        await expect(this.orderSuccess).toHaveText('Thank you for your order!');

        // PDF
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadOrderReceit.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('.pdf');

        await this.page.locator('[data-test="back-to-products"]').click();
        await expect(this.page).toHaveURL(/.*inventory\.html/);
    }
}