import { test } from '@playwright/test';
import { ProductPage } from '../../pageObjects/ProductPage';
import { CartPage } from '../../pageObjects/CartPage';
import fs from 'fs';
import path from 'path'
import { parse } from 'csv-parse/sync'

let product: ProductPage;
let cart: CartPage
let [data] = parse(fs.readFileSync(path.join(__dirname,'../..','fixtures', 'TestData.csv')), {
  columns: true,
  skip_empty_lines: true
});
test.beforeEach(async ({page}) => {
   product = new ProductPage(page);
   cart = new CartPage(page)
});

test('Place order for single product with complete checkout details', async ({ page }) => {
    await product.navigate()
    await product.ensureProductPage()
    var total =  parseFloat(await product.selectProduct(data.product_1))
    await product.addProductToCart()
    await product.navigateToCartPage()
    await cart.ensureProduct(data.product_1)
    await cart.placeOrder(data.name, data.country, data.city, data.creditcard, data.month, data.year, total)
    await cart.ensureOrder()
    await page.close()
});

test('Place order for multiple products product with complete checkout details', async ({ page }) => {
  var total;
  await product.navigate()
  await product.ensureProductPage()
  total =  parseFloat(await product.selectProduct(data.product_1))
  await product.addProductToCart()
  //PRODUCT 2
  await product.navigateToHomePage()
  await product.ensureProductPage()
  total =  total + parseFloat(await product.selectProduct(data.product_2))
  await product.addProductToCart()

  await product.navigateToCartPage()
  await cart.ensureProduct(data.product_1)
  await cart.ensureProduct(data.product_2)
  await cart.placeOrder(data.name, data.country, data.city, data.creditcard, data.month, data.year, total)
  await cart.ensureOrder()
  await page.close()
});

test('Place order with incomplete checkout details', async ({ page }) => {
  await product.navigate()
  await product.ensureProductPage()
  var total =  parseFloat(await product.selectProduct(data.product_1))
  await product.addProductToCart()
  await product.navigateToCartPage()
  await cart.ensureProduct(data.product_1)
  await cart.placeOrder("", "", "", "", "", "", total)
  await page.close()
});



