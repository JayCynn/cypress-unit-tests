const fs = require('fs');
const path = require('path');

describe('Extract AntD Table Data and Write to CSV', () => {
  const filePath = 'cypress/output/tableData.csv';

  before(() => {
    // Ensure the output directory exists and clear old data
    if (!fs.existsSync('cypress/output')) {
      fs.mkdirSync('cypress/output');
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Remove old file
    }
    fs.writeFileSync(filePath, ''); // Create a new empty file
  });

  it('Extracts data row by row and writes to a CSV file across paginated pages', () => {
    cy.visit('http://localhost:3000/transactions');

    // Function to extract table data from the current page
    const extractTableData = () => {
      const rowsData = [];
      cy.get('.ant-table-row').each(($row) => {
        const row = [];
        cy.wrap($row)
          .find('td')
          .each(($cell) => {
            row.push($cell.text().trim());
          })
          .then(() => {
            rowsData.push(row);
          });
      }).then(() => {
        if (rowsData.length) {
          // Write data to CSV file
          const csvData = rowsData.map((row) => row.join(',')).join('\n');
          fs.appendFileSync(filePath, `${csvData}\n`);
        }
      });
    };

    // Function to navigate pages and extract data
    const processAllPages = () => {
      extractTableData(); // Extract data from the current page
      cy.get('.ant-pagination-next')
        .then(($nextButton) => {
          if (!$nextButton.hasClass('ant-pagination-disabled')) {
            cy.wrap($nextButton).click(); // Click Next button
            cy.wait(2000); // Wait for the next page to load
            processAllPages(); // Recursively process the next page
          }
        });
    };

    // Start processing pages
    processAllPages();

    // Verify file is written
    cy.wrap(null).then(() => {
      expect(fs.existsSync(filePath)).to.be.true;
    });
  });
});
