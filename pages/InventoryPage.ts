import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async addItemToCart(itemName: string): Promise<void> {
    const addButton = this.page.locator(
      `.inventory_item:has-text("${itemName}") button`
    );
    await addButton.click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const removeButton = this.page.locator(
      `.inventory_item:has-text("${itemName}") button`
    );
    await removeButton.click();
  }

  async getItemPrice(itemName: string): Promise<string> {
    const price = this.page.locator(
      `.inventory_item:has-text("${itemName}") .inventory_item_price`
    );
    return (await price.textContent()) ?? '';
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.shoppingCartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden(): Promise<void> {
    await expect(this.shoppingCartBadge).not.toBeVisible();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.productItems).toHaveCount(count);
  }
}
