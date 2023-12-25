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
    }

    async ensureProductPage(){
        expect(await this.page.locator('a:has-text("PRODUCT STORE")').isVisible()).toBeTruthy();
        expect(await this.page.locator('.list-group').isVisible()).toBeTruthy()
    }

    async addProductToCart(productName){
        await this.page.locator('.hrefch:text("'+productName+'")').click()
        await expect(await this.page.locator('.name')).toContainText(productName)
        await expect(await this.page.locator('.description').isVisible()).toBeTruthy()
        await this.page.getByRole('link', { name: 'Add to cart' }).click();
        return this.getPrice()
    }

    async getPrice(){
        var price = await this.page.locator('.price-container');
        var textContent = (await price.textContent()).match(/\d+/);
        var result = textContent ? textContent[0] : null;
        return result
    }

}module.exports = {ProductPage}