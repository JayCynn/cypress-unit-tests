const { closeAllModals } = require("../components/helperFunctions");
const {login} = require("../components/login");
// Import Cypress XPath package
require('cypress-xpath');

// Define the test suite
describe('Bank Transfer Deposit Flow', () => {

  // Using fixture to load data
  beforeEach(() => {
    cy.fixture('constants').as('data'); // Loads data from a fixture named 'constants.json'
  });

  it('Performs a bank transfer deposit', function () {
    // Step 1: Login using the helper function
    login(this.data.envUrl, this.data.username, this.data.password);

    // Step 2: Click on //a[@href="/#"]
    cy.xpath('//a[@href="/#"]').click();
    cy.wait(5000); // Wait for the page to load

    // Step 3: Click on Bank Transfer button
    cy.xpath('//*[@id="type"]//button//span[contains(normalize-space(), "Bank Transfer")]').click();
    cy.wait(2000); // Wait for the page to load

    // Step 4: Click on the bank selection icon
    cy.xpath('(//*[@id="bankId"]//img[contains(@alt, "bank selection icon")])[1]').click();

    // Step 5: Click on the "100" amount button
    cy.xpath('//*[@id="amount"]//button[normalize-space() ="100"]').click();

    // Step 6: Upload a file to the attachment input
    const filePath = 'assets/note.txt'; // Update with the actual file path
    cy.xpath('//*[@id="attachments"]//input').attachFile(filePath); // Make sure to have 'cypress-file-upload' plugin installed

    cy.wait(5000); // Wait for any processing
    // Step 7: Click on the submit button
    cy.xpath('//button[@type="submit"]')
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true });
    cy.wait(5000); // Wait for any processing

    // Step 8: Verify that the "Deposit In Progress" popup is visible
    cy.xpath('//*[@id="popup-modal"]/div[contains(normalize-space(), "Deposit In Progress")]')
      .should('be.visible');

      // Navigate to the admin URL
cy.visit(this.data.adminEnvUrl);

// Fill in adminUsername and adminPassword
cy.xpath('//*[@id="basic_username"]').type(this.data.adminUsername);
cy.xpath('//*[@id="basic_password"]').type(this.data.adminPassword);

// Click the login button
cy.xpath('//button[@type="submit"]').click();
cy.wait(5000); // Wait for the page to load


// Navigate to the new deposit page
cy.xpath('//a[@href="/transactions/deposit?mode=new"]').click();


cy.wait(5000); // Wait for the page to load

  cy.xpath('(//td[contains(normalize-space(), "60122799255")])[1]//parent::tr//td[last()]//span').click();

  cy.xpath('//button[contains(normalize-space(), "Approve")]')
  .should('be.visible') // Ensure the button is visible
  .click();

  cy.wait(3000)

  cy.visit(this.data.envUrl);
  cy.wait(3000);

  // Call the external function to close all close icons
  closeAllModals();


 cy.xpath('(//*[contains(@class, "navbottom-item")])[4]')
      .should('be.visible') // Ensure the image is visible
      .click(); // Perform the click

    // Step 3: Verify the presence of "APPROVED" status
    cy.xpath('(//tr)[2]//td[2]//div[contains(normalize-space(), "COMPLETED")]')
      .should('exist') // Ensure the element exists in the DOM
      .should('be.visible'); // Ensure the element is visible

    });
});
