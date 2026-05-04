import { test, expect } from '../../fixtures';

/**
 * Feature: Shopping Cart
 * Test Plan:
 *  TC-CART-01: Add a single item to cart — badge updates (@smoke)
 *  TC-CART-02: Add multiple items — cart reflects correct count (@regression)
 *  TC-CART-03: Remove item from inventory page — badge decrements (@regression)
 *  TC-CART-04: Remove item from cart page (@regression)
 *  TC-CART-05: Complete full checkout flow (@smoke)
 *  TC-CART-06: Checkout fails when shipping info is missing (@regression)
 */

test.describe('Shopping Cart Feature', () => {
  // Use the authenticatedPage fixture — skips login boilerplate in every test
  test.beforeEach(async ({ authenticatedPage }) => {
    // fixture handles navigation + login automatically
  });

  test(
    'TC-CART-01: should update cart badge when item is added @smoke',
    async ({ authenticatedPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.expectCartBadgeCount(1);
    }
  );

  test(
    'TC-CART-02: should reflect correct count with multiple items @regression',
    async ({ authenticatedPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.addItemToCart('Sauce Labs Bike Light');
      await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
      await authenticatedPage.expectCartBadgeCount(3);
    }
  );

  test(
    'TC-CART-03: should decrement badge when item removed from inventory @regression',
    async ({ authenticatedPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.addItemToCart('Sauce Labs Bike Light');
      await authenticatedPage.removeItemFromCart('Sauce Labs Backpack');
      await authenticatedPage.expectCartBadgeCount(1);
    }
  );

  test(
    'TC-CART-04: should remove item from cart page @regression',
    async ({ authenticatedPage, cartPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.goToCart();
      await cartPage.expectItemInCart('Sauce Labs Backpack');
      await cartPage.removeItem('Sauce Labs Backpack');
      await cartPage.expectItemNotInCart('Sauce Labs Backpack');
      await cartPage.expectCartItemCount(0);
    }
  );

  test(
    'TC-CART-05: should complete full checkout flow @smoke',
    async ({ authenticatedPage, cartPage, checkoutPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
      await checkoutPage.continue();
      await checkoutPage.finish();
      await checkoutPage.expectOrderConfirmed();
    }
  );

  test(
    'TC-CART-06: should show error when checkout info is missing @regression',
    async ({ authenticatedPage, cartPage, checkoutPage }) => {
      await authenticatedPage.addItemToCart('Sauce Labs Backpack');
      await authenticatedPage.goToCart();
      await cartPage.proceedToCheckout();
      // Submit without filling in any info
      await checkoutPage.continue();
      await checkoutPage.expectErrorMessage('First Name is required');
    }
  );
});
