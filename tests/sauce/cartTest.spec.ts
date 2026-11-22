import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import {CartPageModel} from '../../types/sauce.js'

import {SauceLoginPage} from '../../pages/sauce/sauceloginpage.js'
import {SauceCartPage} from '../../pages/sauce/saucecartpage.js'
import {SauceCheckoutPage} from '../../pages/sauce/saucecheckoutpage.js'

const testCases = getTestData<CartPageModel>('testdata/sauce/cartTests.json');

test.describe('Cart tests', () => {

    testCases.forEach((testcase) => {
        test(testcase.commonTestData.testName, async ({page}) => {
            
            await test.step('login', async () => {
                const login = new SauceLoginPage(page)

                await login.navigateToSauceLoginpage()
                await login.login(testcase)
            })
            

            await test.step('add item to cart and procced to cart', async () => {
                const products = new SauceCartPage(page)

                await products.addFirstItemToCart()
                await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

                products.proccedToCart()
            })

            await test.step('checkout', async () => {
                const checkoutpage = new SauceCheckoutPage(page)
                
                await checkoutpage.checkout(testcase)

                await checkoutpage.VerifyorderAndNavigateToHomePage()
            })
            
        })
    })

})



