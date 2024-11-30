// Import Cypress XPath package
require('cypress-xpath');
const { closeAllModals } = require('./helperFunctions');

// Complete login function
export function login(envUrl, username, password) {
  // Navigate to the website using the environment URL
  cy.visit(envUrl);
  cy.wait(3000);

  // Call the external function to close all close icons
  closeAllModals();

  // Check if the login button is visible and clickable before clicking
  cy.xpath('(//*[contains(@class, "accountsummary-login-wrapper")]//button)[2]')
    .then(($button) => {
      if ($button.is(':visible') && !$button.prop('disabled')) {
        // If the button is visible and not disabled, click it
        cy.wrap($button).click();
      }
      // Otherwise, skip clicking and continue
    });

  cy.wait(2000); // Wait for the page to load

  // Fill in the username and password
  cy.xpath('//*[@id="form_username"]').type(username);
  cy.xpath('//*[@id="form_password"]').type(password);

  // Check if the submit button is visible and clickable before clicking
  cy.xpath('//button[@type="submit"]')
    .then(($submitButton) => {
      if ($submitButton.is(':visible') && !$submitButton.prop('disabled')) {
        // If the button is visible and not disabled, click it
        cy.wrap($submitButton).click();
      }
      // Otherwise, skip clicking and continue
    });

  cy.wait(3000); // Wait for the page to load

  // Call the external function to close all close icons again
  closeAllModals();

  const { login } = require('../components/login');
}
