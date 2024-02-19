# Playwright Test Framework for Sprinto Interview

This repository contains an end-to-end testing framework using Playwright. The structure is designed for the Sprinto interview process.

## Folder Structure

    ├── github/                     # GitHub Actions workflow
        └── browserstack.yml        # GitHub Actions for browserstack
        └── playwright.yml          # GitHub Actions for playwright
    ├── src/                        # Source code
       └── common/                  # Common utilities and helper functions
          └── helpers.ts            # General utility functions
          └── loggeer.ts            # Logging utility
       └── fixtures/                # Test data and fixtures
          └── testdata.json         # JSON file containing test data
    ├── pages/                      # Page objects representing different pages
       └── BasePage.ts              # Base page object with common functionality
       └── BookingPage.ts           # Page object for the booking page
       └── HomePage.ts              # Page object for the home page
       └── SearchPage.ts            # Page object for the search page
    ├── selectors                   # Selectors for locating elements on pages
       └── bookingPageSelectors.ts  # Selectors for elements on the booking page
       └── commonSelectors.ts       # Common selectors used across pages
       └── homePageSelectors.ts     # Selectors for elements on the home page
       └── searchPageSelectors.ts   # Selectors for elements on the search page
    ├── tests                       # Test scripts
    └── negativeTest.spec.ts        # Test script for negative scenarios
    └── positiveTest.spec.ts        # Test script for positive scenarios
    ├── utils
       └── helper.ts                # Helper functions
    ├── .gitignore                  # Git ignore file
    ├── browserstack.yml            # BrowserStack configuration file
    ├── package.json                # Node.js package configuration
    ├── playwright.config.ts        # Playwright configuration file
    ├── playwright.local.config.ts  # Local Playwright configuration file
    ├── tsconfig.json               # TypeScript configuration file

## Test Cases
   ### Postive test cases
   - search flight with one way
   - search flight with round trip
   - search flight with round trip with custom date
   - search flight with round trip with customisation

   ### Negative test cases
   - search flight without arrival and departure
   - search flight without arrival
   - search flight without departure
   - search flight with round trip without any flights

## Getting Started

1. **Clone this repository:**

   ```bash
   git clone https://github.com/ank1traj/sprinto.git
   cd sprinto
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Running Tests Locally**
    Execute the following command to run the tests locally:
    ```bash
    yarn test
    ```
4. **Running Tests on BrowserStack**
    To run tests on BrowserStack for cross-browser testing:

    - Configure BrowserStack Credentials:

    - Update your BrowserStack credentials in the `browserstack.yml` file.

    Run BrowserStack Tests:
    ```bash
    yarn browserstack
    ```
    This command will execute the tests on BrowserStack using the specified configuration.


## Additional Commands
Feel free to use any of the following commands supported by Playwright. See the Playwright [documentation](https://playwright.dev/docs/running-tests) for more details.


# GitHub Actions Workflow
The workflow defined in the github/ folder automates the execution of tests using GitHub Actions. After the tests are run, it sends an email notification. Ensure you have configured the necessary secrets in your GitHub repository for email notifications.

# Configuration
The configuration for Playwright is located in `playwright.config.ts`.
Additional configurations can be adjusted in `tsconfig.json`, `browserstack.yml`, etc.

# BrowserStack Integration
If you plan to use BrowserStack for cross-browser testing, configure the credentials and settings in `browserstack.yml`. Ensure that your BrowserStack username and access key are set as environment variables.

This project is licensed under the MIT License.


## Authors

- [@ank1traj](https://www.github.com/ank1traj)

