import type { Locator, Page } from '@playwright/test';
import {CartPageModel} from '../../types/sauce.js'

export class SauceCartPage {
    page: Page
    item : Locator
    cart: Locator

    constructor (page: Page) {
        this.page = page;
        this.item = page.locator('.inventory_item')
        this.cart = page.locator('[data-test="shopping-cart-link"]')
    }

    async addFirstItemToCart () {
        const firstItem = await this.item.first()

        const itemName = (await firstItem.locator('.inventory_item_name').textContent())?.trim
        const itemPrice = (await firstItem.locator('.inventory_item_price').textContent())?.trim

        await firstItem.getByRole('button', { name: 'Add to cart' }).click();
    }

    async proccedToCart () {
        await this.cart.click();
    }
}