const {expect} = require('@playwright/test');

class ProductPage{
    constructor(page){
        this.page = page
    }

    async navigateToHome(){
        await this.page.goto('/')
    }

    async navigateToCartPage(){
        await this.page.getByRole('link', { name: 'Cart', exact: true }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async ensureProductPage(){
        expect(await this.page.locator('a:has-text("PRODUCT STORE")').isVisible()).toBeTruthy();
        expect(await this.page.locator('.list-group').isVisible()).toBeTruthy()
    }

    async selectProduct(productName){
        await this.page.locator('.hrefch:text("'+productName+'")').click()
        await this.page.locator('.product-content ').waitFor({state: "visible"})
        await expect(await this.page.locator('.name')).toContainText(productName)
        await expect(await this.page.locator('.description').isVisible()).toBeTruthy()
        return this.getPrice()
    }

    async addProductToCart(){
        await this.page.getByRole('link', { name: 'Add to cart' }).click();
    }

    async getPrice(){
        var price = await this.page.locator('.price-container');
        var textContent = (await price.textContent()).match(/\d+/);
        var result = textContent ? textContent[0] : null;
        return result
    }

}module.exports = {ProductPage}