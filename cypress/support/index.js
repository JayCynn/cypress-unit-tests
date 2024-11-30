Cypress.on('uncaught:exception', (err, runnable) => {
    // Check if the error message includes a specific string (e.g., React error #425)
    if (err.message.includes('Minified React error #425')) {
      return false; // Ignore this specific error
    }

    console.log(err.message)

    if (err.message.includes('License expired')) {
      return false; // Prevent Cypress from failing the test
  }

  if (err.message.includes('Text content does not match server-rendered HTML')) {
    return false; // Prevent Cypress from failing the test
  }
  
    // Otherwise, let Cypress fail the test for other errors
    return true;
  });