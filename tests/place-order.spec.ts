import { test } from '@playwright/test';
import { ProductPage } from '../pageObjects/ProductPage';
import { CartPage } from '../pageObjects/CartPage';

test('Place order with complete checkout details', async ({ page }) => {
    const product = new ProductPage(page);
    await product.navigateToHome()
    await product.ensureProductPage()
    var total =   await product.addProductToCart('Nokia lumia 1520')
    await product.navigateToCartPage()
    const cart = new CartPage(page)
    await cart.ensureCartPage('Nokia lumia 1520')
    await cart.placeOrder("Name", "Country", "City", "CreditCard", "Month", "Year", total)
    await cart.ensureOrder()
    await page.close()
});

test('Place order with incomplete checkout details', async ({ page }) => {
  const product = new ProductPage(page);
  await product.navigateToHome()
  await product.ensureProductPage()
  var total =   await product.addProductToCart('Nokia lumia 1520')
  await product.navigateToCartPage()
  const cart = new CartPage(page)
  await cart.ensureCartPage('Nokia lumia 1520')
  await cart.placeOrder("", "", "", "", "", "", total)
  await page.close()
});



