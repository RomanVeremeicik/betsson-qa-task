import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async removeItem(itemName: string): Promise<void> {
    const removeButton = this.page.locator(
      `.cart_item:has-text("${itemName}") [data-test^="remove"]`
    );
    await removeButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectItemInCart(itemName: string): Promise<void> {
    await expect(this.page.locator(`.cart_item:has-text("${itemName}")`)).toBeVisible();
  }

  async expectItemNotInCart(itemName: string): Promise<void> {
    await expect(this.page.locator(`.cart_item:has-text("${itemName}")`)).not.toBeVisible();
  }

  async expectCartItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }
}
