import { Page, expect } from '@playwright/test'
import {
    NO_FLIGHTS_FOUND_MESSAGE,
    PLEASE_TRY_AGAIN_MESSAGE,
} from '@common/constants'
import logger from '@common/logger'
import { Helpers } from '@utils/helpers'
import { searchpageSelectors } from '@selectors/searchpageSelectors'
import { commonSelectors } from '@selectors/commonSelectors'
import { PRICE_REGEX } from '@common/regex'

interface CheckNoFlightResult {
    hasNoFlights: boolean
}
export class SearchPage {
    static async checkNoFlightFound(page: Page): Promise<CheckNoFlightResult> {
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

    static async flightDetails(page: Page): Promise<void> {
        await page.locator(searchpageSelectors.stickyParent)
        logger.info('Flight details successfully retrieved.')
    }

    static async sortDeparturePrice(page: Page): Promise<void> {
        await page.locator(searchpageSelectors.departurePrice).click()
        logger.info('Departure prices successfully sorted.')
    }

    static async sortReturnPrice(page: Page): Promise<void> {
        await page.locator(searchpageSelectors.returnPrice).click()
        logger.info('Return prices successfully sorted.')
    }

    static async bookCheapestRoundTripFlight(page: Page): Promise<void> {
        await page.locator(searchpageSelectors.bookNowButton).click()
    }

    static async getOneWayFlightAndSortAndBookCheapest(
        page: Page
    ): Promise<void> {
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
                    const numericPart = priceValue.match(PRICE_REGEX)

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
