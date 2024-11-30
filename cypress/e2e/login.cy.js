const { login } = require("../components/login");


// Define the test suite
describe('Navigate, Login, and Validate Greeting', () => {

  // Using fixture to load data
  beforeEach(() => {
    cy.fixture('constants').as('data'); // Loads data from a fixture named 'constants.json'
  });

  it('Performs login and validates greeting text', function () {
    // Use the complete login function with data from the fixture
    login(this.data.envUrl, this.data.username, this.data.password);

  });
});
