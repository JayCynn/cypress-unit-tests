const { closeAllModals } = require("../components/helperFunctions");
const { login } = require("../components/login");
// Import Cypress XPath package
require('cypress-xpath');

// Define the test suite
describe('Bank Withdrawal Flow', () => {
  // Using fixture to load data
  beforeEach(() => {
    cy.fixture('constants').as('data'); // Loads data from a fixture named 'constants.json'
  });

  it('Performs a bank withdrawal', function () {
    // Step 1: Login using the helper function
    login(this.data.envUrl, this.data.username, this.data.password);

    // Step 2: Navigate to Withdrawal section
    cy.xpath('//a[@href="/#"]').click(); // Adjust based on the actual selector for navigation
    cy.wait(5000); // Wait for the page to load

    // Step 3: Click on the "Withdraw Funds" button
    cy.xpath('//*[@id="type"]//button//span[contains(normalize-space(), "Withdraw Funds")]').click();
    cy.wait(2000); // Wait for the page to load

    // Step 4: Select a bank for withdrawal
    cy.xpath('(//*[@id="bankId"]//img[contains(@alt, "bank selection icon")])[1]').click();

    // Step 5: Enter withdrawal amount
    cy.xpath('//*[@id="amount"]//input').type('500'); // Adjust based on the amount input selector

    // Step 6: Upload a file to the attachment input (if required)
    const filePath = 'assets/note.txt'; // Update with the actual file path
    cy.xpath('//*[@id="attachments"]//input').attachFile(filePath); // Ensure 'cypress-file-upload' plugin is installed

    cy.wait(5000); // Wait for any processing

    // Step 7: Click on the submit button
    cy.xpath('//button[@type="submit"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true });

    cy.wait(5000); // Wait for processing

    // Step 8: Verify that the "Withdrawal In Progress" popup is visible
    cy.xpath('//*[@id="popup-modal"]/div[contains(normalize-space(), "Withdrawal In Progress")]')
      .should('be.visible');

    // Step 9: Navigate to the admin panel to approve the withdrawal
    cy.visit(this.data.adminEnvUrl);

    // Login as admin
    cy.xpath('//*[@id="basic_username"]').type(this.data.adminUsername);
    cy.xpath('//*[@id="basic_password"]').type(this.data.adminPassword);
    cy.xpath('//button[@type="submit"]').click();
    cy.wait(5000); // Wait for the admin panel to load

    // Navigate to the withdrawal approvals section
    cy.xpath('//a[@href="/transactions/Withdrawal?mode=new"]').click();
    cy.wait(5000); // Wait for the page to load

    // Approve the specific withdrawal
    cy.xpath('(//td[contains(normalize-space(), "60122799255")])[1]//parent::tr//td[last()]//span').click();
    cy.xpath('//button[contains(normalize-space(), "Approve")]')
      .should('be.visible')
      .click();

    cy.wait(3000); // Wait for approval processing

    // Step 10: Verify the withdrawal status in the user dashboard
    cy.visit(this.data.envUrl);
    cy.wait(3000);

    // Close all modals if any are open
    closeAllModals();

    // Navigate to the transaction history section
    cy.xpath('(//*[contains(@class, "navbottom-item")])[4]')
      .should('be.visible')
      .click();

    // Verify the status of the withdrawal
    cy.xpath('(//tr)[2]//td[2]//div[contains(normalize-space(), "COMPLETED")]')
      .should('exist')
      .should('be.visible');
  });
});
