const fs = require('fs');
const { login } = require('../../components/login');

describe('Check Game URLs and Record Results', () => {
  before(() => {
    // Load the JSON file
    cy.fixture('brandgames.json').as('gameData');
  });

  it('Navigates URLs and Records Not Found Games', function () {
    const results = []; // Store results here

    // Perform login
    login("https://stg.888sama.com", "60122799255", "pass@word1");

    //only take first 4 items of game data
    this.gameData = this.gameData.slice(4, 5);
    // Iterate over game data
    this.gameData.forEach(entry => {
      const { brandName, brandId, gameProfileId, gameIds } = entry;

      // Iterate over gameIds
      gameIds.slice(150, 185).forEach(gameId => {
        // Handle both string and _id.$oid formats
        const gameIdValue = typeof gameId === 'string' ? gameId : gameId._id.$oid;

        // Construct the URL
        const url = `https://stg.888sama.com/game_website?brandId=${brandId}&gameProfileId=${gameProfileId}&gameId=${gameIdValue}`;

        // Visit the URL
        cy.visit(url);

        // Add a delay of 10 seconds
        cy.wait(5000);

        cy.get('body').then($body => {
          if ($body.find('div.modal-body .text-primary').length > 0) {
            // If the element is present, add to results
            results.push({
              brandName,
              gameProfileId,
              gameId: gameIdValue,
              status: 'Not Available'
            });
          }
        })

      });
    });

    // Write results to a CSV file after processing all URLs
    cy.wrap(null).then(() => {
      const csvContent = results
        .map(row => `${row.brandName},${row.gameProfileId},${row.gameId},${row.status}`)
        .join('\n');

      // Add CSV header
     

      // Write to results.csv in the project root
      cy.task('writeCsv', { filename: 'results.csv', content:  csvContent });
    });
  });
});
