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

test.describe('positve testcase', () => {
    test.only('search flight with one way', async ({ page, context }) => {
        try {
            test.setTimeout(60000);
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.WhereFromAirport)
            await HomePage.searchWhereTo(page, testdata.whereTo, testdata.WhereToAirport)
            await HomePage.selectDepartureDate(page)

            await HomePage.searchFlight(page)

            const result = await SearchPage.checkNoFlightFound(page);

            if (result.hasNoFlights) {
                logger.info('No flights available for the selected criteria. Implementing error handling...');
                logger.warn('Warning: No flights were found for the specified search criteria.');
                logger.warn('Warning: Please try again with different airports or dates.');
            } else {
                logger.info('Flights successfully found for the specified search criteria.');
                await SearchPage.flightDetails(page)
                await SearchPage.getOneWayFlightAndSortAndBookCheapest(page)
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

    test('search flight with round trip', async({ page, context }) => {
        try {
            test.setTimeout(60000);
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.WhereFromAirport)
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

    test('search flight with round trip with custom date', async({ page, context }) => {
        try {
            test.setTimeout(60000);
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.WhereFromAirport)
            await HomePage.searchWhereTo(page, testdata.whereTo, testdata.WhereToAirport)
            await HomePage.selectDepartureDate(page, testdata.departureDate)
            await HomePage.selectReturnDate(page, testdata.returnDate)

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

    test('search flight with round trip with customisation', async({ page, context }) => {
        try {
            test.setTimeout(60000);
            await HomePage.customizeFlightOptions(page, testdata.classType)
            await HomePage.searchWhereFrom(page, testdata.whereFrom, testdata.WhereFromAirport)
            await HomePage.searchWhereTo(page, testdata.whereTo, testdata.WhereToAirport)
            await HomePage.selectDepartureDate(page, testdata.departureDate)
            await HomePage.selectReturnDate(page, testdata.returnDate)

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
