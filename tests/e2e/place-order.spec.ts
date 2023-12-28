import { test } from '@playwright/test';
import { ProductPage } from '../../pageObjects/ProductPage';
import { CartPage } from '../../pageObjects/CartPage';

test('Place order for single product with complete checkout details', async ({ page }) => {
    const product = new ProductPage(page);
    await product.navigate()
    await product.ensureProductPage()
    var total =  parseFloat(await product.selectProduct('Nokia lumia 1520'))
    await product.addProductToCart()
    await product.navigateToCartPage()
    const cart = new CartPage(page)
    await cart.ensureProduct('Nokia lumia 1520')
    await cart.placeOrder("Name", "Country", "City", "CreditCard", "Month", "Year", total)
    await cart.ensureOrder()
    await page.close()
});

test('Place order for multiple products product with complete checkout details', async ({ page }) => {
  const product = new ProductPage(page);
  var total;
  await product.navigate()
  await product.ensureProductPage()
  total =  parseFloat(await product.selectProduct('Nokia lumia 1520'))
  await product.addProductToCart()
  //PRODUCT 2
  await product.navigateToHomePage()
  await product.ensureProductPage()
  total =  total + parseFloat(await product.selectProduct('Samsung galaxy s6'))
  await product.addProductToCart()

  await product.navigateToCartPage()
  const cart = new CartPage(page)
  await cart.ensureProduct('Nokia lumia 1520')
  await cart.ensureProduct('Samsung galaxy s6')
  await cart.placeOrder("Name", "Country", "City", "CreditCard", "Month", "Year", total)
  await cart.ensureOrder()
  await page.close()
});

test('Place order with incomplete checkout details', async ({ page }) => {
  const product = new ProductPage(page);
  await product.navigate()
  await product.ensureProductPage()
  var total =  parseFloat(await product.selectProduct('Nokia lumia 1520'))
  await product.addProductToCart()
  await product.navigateToCartPage()
  const cart = new CartPage(page)
  await cart.ensureProduct('Nokia lumia 1520')
  await cart.placeOrder("", "", "", "", "", "", total)
  await page.close()
});



