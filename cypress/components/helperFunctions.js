require('cypress-xpath');

function closeAllModals() {
  cy.xpath('//*[contains(@class, "modal-dialog")]//*[@data-icon="close"]')
    .then(($elements) => {
      const numberOfClicks = $elements.length;
      for (let i = 0; i < numberOfClicks; i++) {
        cy.wrap($elements).each(($el) => {
          cy.wrap($el).then((el) => {
            if (el.is(':visible') && !el.prop('disabled')) {
              cy.wrap(el).click();
            }
          });
        });
        cy.wait(500);
      }
    });
}

function waitForElement(xpath, timeout = 5000) {
  cy.xpath(xpath, { timeout })
    .should('be.visible')
    .and('not.be.disabled');
}

function scrollToElement(xpath) {
  cy.xpath(xpath).scrollIntoView({ easing: 'linear', duration: 500 });
}

function clickElement(xpath) {
  cy.xpath(xpath)
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true });
}

function checkText(xpath, expectedText) {
  cy.xpath(xpath).should('contain.text', expectedText);
}

function typeIntoInput(xpath, text) {
  cy.xpath(xpath)
    .should('be.visible')
    .clear()
    .type(text);
}

function selectDropdownByText(xpath, text) {
  cy.xpath(xpath).select(text, { force: true });
}

function verifyElementCount(xpath, expectedCount) {
  cy.xpath(xpath).should('have.length', expectedCount);
}

function waitForSpinnerToFinish(spinnerXpath, timeout = 10000) {
  cy.xpath(spinnerXpath, { timeout }).should('not.exist');
}

function verifyAttributeValue(xpath, attribute, expectedValue) {
  cy.xpath(xpath).should('have.attr', attribute, expectedValue);
}

function handleAlert(accept = true) {
  cy.on('window:alert', (text) => {
    cy.log(`Alert text: ${text}`);
    if (accept) {
      cy.wrap(Cypress).then(() => true);
    }
  });
}

function validateModalVisibility(modalXpath) {
  cy.xpath(modalXpath).should('be.visible');
}

function uploadFile(inputXpath, filePath) {
  cy.xpath(inputXpath).attachFile(filePath);
}

function waitAndRetry(xpath, maxRetries = 5, interval = 1000) {
  let retries = 0;
  const tryClick = () => {
    cy.xpath(xpath)
      .should('be.visible')
      .then(($el) => {
        if ($el.is(':visible') && !$el.prop('disabled')) {
          cy.wrap($el).click();
        } else if (retries < maxRetries) {
          retries++;
          cy.wait(interval);
          tryClick();
        } else {
          throw new Error('Element not clickable after max retries');
        }
      });
  };
  tryClick();
}

function verifyTableRowContainsText(tableXpath, rowIndex, expectedText) {
  cy.xpath(`${tableXpath}//tr[${rowIndex}]`).should('contain.text', expectedText);
}

function logout(logoutXpath) {
  cy.xpath(logoutXpath).should('be.visible').click();
}

module.exports = {
  closeAllModals,
  waitForElement,
  scrollToElement,
  clickElement,
  checkText,
  typeIntoInput,
  selectDropdownByText,
  verifyElementCount,
  waitForSpinnerToFinish,
  verifyAttributeValue,
  handleAlert,
  validateModalVisibility,
  uploadFile,
  waitAndRetry,
  verifyTableRowContainsText,
  logout,
};
