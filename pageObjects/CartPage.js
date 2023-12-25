const {expect} = require('@playwright/test');

class CartPage{
    constructor(page){
        this.page = page
    }

    async ensureCartPage(productName){
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        expect(await this.page.locator(".table-responsive").isVisible()).toBeTruthy()
        expect(await this.page.locator('tr:has-text("'+productName+'")').isVisible()).toBeTruthy();
    }

    async placeOrder(Name, Country, City, CreditCard, Month, Year, total){
        let dialogMessage;
        await this.page.locator('button:text("Place Order")').click()
        await this.ensureTotal(total)
        await this.addPaymentDetails(Name, Country, City, CreditCard, Month, Year)
        this.page.on('dialog', async(dialog) => {
            dialogMessage=  dialog.message()
            await dialog.accept();
        })
        await this.page.locator('button:text("Purchase")').click()
        if(dialogMessage != null){
            await expect(dialogMessage).toEqual("Please fill out Name and Creditcard.")
        }        
    }
    
    async ensureTotal(expectedTotal){
        const elem = await this.page.locator('#totalm')
        const actualTotal = (await elem.textContent()).split(' ')[1];
        expect(actualTotal).toEqual(expectedTotal)
    }

    async addPaymentDetails(Name, Country, City, CreditCard, Month, Year){
        await this.page.locator('#name').fill(Name);
        await this.page.locator('#country').fill(Country);
        await this.page.locator('#city').fill(City);
        await this.page.locator('#card').fill(CreditCard);
        await this.page.locator('#month').fill(Month);
        await this.page.locator('#year').fill(Year);   
    }

    async ensureOrder(){
        await expect(await this.page.locator('.lead').isVisible).toBeTruthy()
    }

}module.exports = {CartPage}