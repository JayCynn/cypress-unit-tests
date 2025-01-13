const { defineConfig } = require("cypress");
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      const fs = require('fs');
    
      on('task', {
        writeCsv({ filename, content }) {
          const header = 'brandName,gameProfileId,gameId,status\n'; // Define the header here
    
          // Check if the file exists
          if (!fs.existsSync(filename)) {
            // If the file doesn't exist, create it and write the header and content
            fs.writeFileSync(filename, header + content, 'utf8');
          } else {
            // If the file exists, append only the content
            fs.appendFileSync(filename, content, 'utf8');
          }
          return null; // Indicate success
        }
      });
    }
    
  },
});