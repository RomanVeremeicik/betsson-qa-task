import { test, expect } from '../../fixtures';

/**
 * Feature: Login
 * Test Plan:
 *  TC-LOGIN-01: Successful login with valid credentials (@smoke)
 *  TC-LOGIN-02: Login fails with invalid password (@regression)
 *  TC-LOGIN-03: Login fails with locked-out user (@regression)
 *  TC-LOGIN-04: Login fails with empty credentials (data-driven) (@regression)
 */

test.describe('Login Feature', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test(
    'TC-LOGIN-01: should login successfully with valid credentials @smoke',
    async ({ loginPage }) => {
      await loginPage.login(
        process.env.STANDARD_USER ?? 'standard_user',
        process.env.TEST_PASSWORD ?? 'secret_sauce'
      );
      await loginPage.expectRedirectToInventory();
    }
  );

  test(
    'TC-LOGIN-02: should show error for invalid password @regression',
    async ({ loginPage }) => {
      await loginPage.login('standard_user', 'wrong_password');
      await loginPage.expectErrorMessage(
        'Username and password do not match any user in this service'
      );
    }
  );

  test(
    'TC-LOGIN-03: should show error for locked-out user @regression',
    async ({ loginPage }) => {
      await loginPage.login(
        process.env.LOCKED_USER ?? 'locked_out_user',
        process.env.TEST_PASSWORD ?? 'secret_sauce'
      );
      await loginPage.expectErrorMessage('Sorry, this user has been locked out');
    }
  );

  const emptyCredentialCases = [
    { username: '',              password: 'secret_sauce', error: 'Username is required'  },
    { username: 'standard_user', password: '',             error: 'Password is required'  },
    { username: '',              password: '',             error: 'Username is required'  },
  ];

  for (const { username, password, error } of emptyCredentialCases) {
    test(
      `TC-LOGIN-04: should show "${error}" when username="${username || '<empty>'}" password="${password || '<empty>'}" @regression`,
      async ({ loginPage }) => {
        await loginPage.login(username, password);
        await loginPage.expectErrorMessage(error);
      }
    );
  }
});
