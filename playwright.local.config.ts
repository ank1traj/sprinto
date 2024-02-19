// This is a sample config for what users might be running locally
const config = {
    testDir: './src/tests',
    /* tests in parallel */
    workers: 1,
    disableAutoCaptureLogs: true,
    retries: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'line',
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'chrome',
            use: {
                browserName: 'chromium',
                channel: 'chrome',
            },
        },
    ],
}

module.exports = config
