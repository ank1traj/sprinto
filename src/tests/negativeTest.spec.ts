import { test } from '@playwright/test';
import logger from '@common/logger';
import testdata from '@fixtures/testdata.json';
import { BasePage } from '@pages/BasePage';
import { HomePage } from '@pages/HomePage';
import { SearchPage } from '@pages/SearchPage';
import { BookingPage } from '@pages/BookingPage';

test.beforeEach(async ({ page }) => {
    await BasePage.open(page, testdata.urls.baseURL);
    await HomePage.closeLoginBanner(page);
});

test.describe('negative testcase', () => {

    test.only('search flight without arrival and departure', async ({ page }) => {
        try {
            await HomePage.searchFlight(page);
            await HomePage.searchFlightWithoutArrivalAndDeparture(page)
        }
        catch (error) {
            logger.error(`Test encountered an error: ${error.message}`);
            throw error;
        }
    });

    test('search flight without arrival', async ({ page }) => {
        try {
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.WhereFromAirport)
            await HomePage.searchFlight(page)

            await HomePage.searchFlightWithoutArrival(page)
        }
        catch (error) {
            logger.error(`Test encountered an error: ${error.message}`);
            throw error;
        }
    });

    test('search flight without departure', async ({ page }) => {
        try {
            await HomePage.searchWhereTo(page, testdata.whereTo, testdata.WhereToAirport)
            await HomePage.searchFlight(page)

            await HomePage.searchFlightWithoutDeparture(page)
        }
        catch (error) {
            logger.error(`Test encountered an error: ${error.message}`);
            throw error;
        }
    });

    test('search flight with round trip without any flights', async({ page, context }) => {
        try {
            test.setTimeout(60000);
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.wrongWhereFromAirport)
            await HomePage.searchWhereTo(page, testdata.whereTo, testdata.WhereToAirport)
            await HomePage.selectDepartureDate(page)
            await HomePage.selectReturnDate(page)

            await HomePage.searchFlight(page)

            const result = await SearchPage.checkNoFlightFound(page);

            if (result.hasNoFlights) {
                logger.info('No flights available for the selected criteria. Implementing error handling...');
                logger.warn('Warning: No flights were found for the specified search criteria.');
                logger.warn('Warning: Please try again with different airports or dates.');
            } else {
                logger.info('Flights successfully found for the specified search criteria.');
                await SearchPage.flightDetails(page)
                await SearchPage.bookCheapestRoundTripFlight(page)
                const [newtab] = await Promise.all([
                    context.waitForEvent('page'),
                ]);
                await BookingPage.viewBookingPage(newtab);
            }
        }
        catch (error) {
            logger.error(`Test encountered an error: ${error.message}`);
            throw error;
        }
    });
})
