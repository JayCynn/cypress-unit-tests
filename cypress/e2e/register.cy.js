const { closeAllModals } = require('../components/helperFunctions');
require('cypress-xpath');

// Helper function to process iframe
const getIframeBody = (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
};

describe('User Registration Flow with Verification and API Call', () => {
  before(() => {
    // Load constants from fixture
    cy.fixture('constants').as('data'); // Load data from 'constants.json'

    // Load user data from CSV file before the test suite
    cy.readFile('cypress/fixtures/users.csv').then((fileContent) => {
      const rows = fileContent.trim().split('\n'); // Ensure no extra newlines
      const headers = rows.shift().split(',');

      const users = rows.map(row => {
        const values = row.split(',');
        return headers.reduce((acc, header, index) => {
          acc[header.trim()] = values[index]?.trim(); // Handle potential undefined values
          return acc;
        }, {});
      });

      cy.wrap(users).as('usersData'); // Store users data
    });
  });

  it('Registers multiple users with unique data from CSV', function () {
    // Access users data loaded in the 'before' hook
    cy.get('@usersData').then((users) => {
      users.forEach(user => {
        // Step 1: Go to the specified URL
        cy.visit('http://localhost:3000/register');
        cy.wait(3000); // Wait for the page to load

        // Step 2: Fill in the full name
        cy.xpath('//*[@id="fullName"]').type(user.fullName);

        // Step 3: Fill in the phone number
        cy.xpath('//*[@id="phoneNumber"]').type(user.phoneNumber);

        // Step 4: Click on "Get Code" button
        cy.xpath('//*[@id="page-container"]//button[contains(normalize-space(), "Get Code")]').click();
        cy.wait(5000); // Wait for any response or loading

        // Step 5: Click on the button in the popup modal
        cy.xpath('//*[@id="popup-modal"]//button[contains(normalize-space(), "Close")]').click();

        // Step 6: Fill in the password
        cy.xpath('//*[@id="password"]').type(user.password);

        // Step 7: Fill in the referrer
        cy.xpath('//*[@id="referrer"]').type(user.referrer);

        cy.wait(5000);

        // Step 8: Navigate to the admin page
        cy.get('@data').then((data) => {
          cy.visit(data.adminEnvUrl);
          cy.wait(3000); // Wait for the admin page to load

          // Step 9: Fill in the admin credentials
          cy.xpath('//*[@id="basic_username"]').type('admin-jc');
          cy.xpath('//*[@id="basic_password"]').type('123456');

          // Step 10: Click the submit button to log in
          cy.xpath('//*[@id="basic"]//button[@type="submit"]').click();
          cy.wait(3000); // Wait for the login to process

          // Step 11: Navigate to the verifications page
          cy.xpath('//*[contains(@class, "ant-menu-title-content") and contains(normalize-space(), "Verification Code")]')
            .click();
          cy.wait(3000); // Wait for the verifications page to load

          // Step 12: Get the text of the first <tr> and third <td> within the #kioskForm
          cy.xpath('//*[@id="kioskForm"]//tr/td[2]').each(($td, index) => {
            const phoneNumberText = $td.text().trim();

            if (phoneNumberText === user.phoneNumber) {
              cy.xpath(`//*[@id="kioskForm"]//tr[${index + 1}]/td[3]`).invoke('text').then((verificationCode) => {
                // Log the verification code to the console
                cy.log('Verification Code:', verificationCode);
                console.log('Verification Code:', verificationCode);

                // Step 13: Navigate back to the registration page
                cy.visit('http://localhost:3000/register');
                cy.wait(3000); // Wait for the page to load

                // Step 14: Fill in the full name
                cy.xpath('//*[@id="fullName"]').type(user.fullName);

                // Step 15: Fill in the phone number
                cy.xpath('//*[@id="phoneNumber"]').type(user.phoneNumber);

                // Step 16: Fill in the password
                cy.xpath('//*[@id="password"]').type(user.password);

                // Step 17: Fill in the referrer
                cy.xpath('//*[@id="referrer"]').type(user.referrer);

                // Step 18: Fill in the verification code directly (skip "Get Code" button)
                cy.xpath('//*[@id="verifyContactNoCode"]').type(verificationCode);

                // Solve reCAPTCHA
                cy.get('iframe[title="reCAPTCHA"]').then(($iframe) => {
                  const body = $iframe.contents().find('body');
                  cy.wrap(body).find('#recaptcha-anchor').click();
                });

                cy.wait(3000);

                // Step 19: Submit the form
                cy.xpath('//button[@type="submit"]').click();
                cy.wait(60000); // Wait for the completion
              });
            }
          });
        });
      });
    });
  });
});
