import { expect } from '@playwright/test'
import {
    NO_FLIGHTS_FOUND_MESSAGE,
    PLEASE_TRY_AGAIN_MESSAGE,
} from '@common/constants'
import logger from '@common/logger'
import { Helpers } from '@utils/helpers'
import { searchpageSelectors } from '@selectors/searchpageSelectors'
import { commonSelectors } from '@selectors/commonSelectors'

export class SearchPage {
    static async checkNoFlightFound(page) {
        try {
            await page.waitForSelector(searchpageSelectors.errorMessage, {
                timeout: 5000,
            })
            await page.waitForSelector(searchpageSelectors.tryAgainMessage, {
                timeout: 5000,
            })

            const noFlightsMessage = await page.textContent(
                searchpageSelectors.errorMessage
            )
            const tryAgainMessage = await page.textContent(
                searchpageSelectors.tryAgainMessage
            )

            expect(noFlightsMessage).toBe(NO_FLIGHTS_FOUND_MESSAGE)
            expect(tryAgainMessage).toBe(PLEASE_TRY_AGAIN_MESSAGE)

            logger.info('No flights found message confirmed.')

            return {
                hasNoFlights: true,
            }
        } catch (error) {
            logger.error(
                `Error in checkNoFlightFound function: ${error.message}`
            )

            return {
                hasNoFlights: false,
            }
        }
    }

    static async flightDetails(page) {
        await page.locator(searchpageSelectors.stickyParent)
        logger.info('Flight details successfully retrieved.')
    }

    static async sortDeparturePrice(page) {
        await page.locator(searchpageSelectors.departurePrice).click()
        logger.info('Departure prices successfully sorted.')
    }

    static async sortReturnPrice(page) {
        await page.locator(searchpageSelectors.returnPrice).click()
        logger.info('Return prices successfully sorted.')
    }

    static async bookCheapestRoundTripFlight(page) {
        await page.locator(searchpageSelectors.bookNowButton).click()
    }

    static async getOneWayFlightAndSortAndBookCheapest(page) {
        await Helpers.scrollUntilSelectorFound(page, commonSelectors.footer)

        await page.waitForSelector(searchpageSelectors.allOneWayFlight, {
            timeout: 15000,
        })
        const allFlights = await page.$$(searchpageSelectors.allOneWayFlight)

        let lowestPrice = Number.MAX_VALUE
        let lowestPriceIndex

        await Promise.all(
            allFlights.map(async (flight, i) => {
                const details = await flight.innerText()
                const detailsArray = details.split('\n')
                const priceValue = detailsArray.find((value) =>
                    value.includes('₹')
                )

                if (priceValue) {
                    const numericPart = priceValue.match(/[0-9,]+/)

                    if (numericPart) {
                        const numericValue = parseInt(
                            numericPart[0].replace(/,/g, ''),
                            10
                        )
                        if (numericValue < lowestPrice) {
                            lowestPrice = numericValue
                            lowestPriceIndex = i
                        }
                    }
                }
                return detailsArray
            })
        )
        Helpers.clickLowestPriceButton(page, lowestPriceIndex)
    }
}
