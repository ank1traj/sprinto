import logger from '@common/logger'
import testData from '@fixtures/testdata.json'
import { Helpers } from '@utils/helpers'
import {
    ONE_WAY,
    ROUND_TRIP,
    CLASS_TYPES,
    NO_ARRIVAL_ERROR_MESSAGE,
    NO_DEPARTURE_ERROR_MESSAGE,
    NO_ARRIVAL_DEPARTURE_ERROR_MESSAGE,
} from '@common/constants'
import { expect } from '@playwright/test'
import { commonSelectors } from 'selectors/commonSelectors'
import { homepageSelectors } from 'selectors/homepageSelectors'

export class HomePage {
    static async closeLoginBanner(page) {
        try {
            const loginBannerLocator = page.locator(commonSelectors.loginBanner)
            await expect(loginBannerLocator).toBeVisible()
            logger.info('Closed the login banner successfully.')
            await page.locator(commonSelectors.loginBannerCloseIcon).click()
        } catch (error) {
            logger.info('No login banner appeared or it was not visible.')
        }
    }

    static async searchWhereFrom(page, whereFrom, whereFromAirport) {
        await page.getByPlaceholder('Where from?').click()
        await page.getByPlaceholder('Where from?').fill(whereFrom)
        await page.waitForTimeout(2000)
        const allFrom = await page
            .locator(homepageSelectors.dropdownSelector)
            .textContent()
        const airportEntries = allFrom.match(/([A-Z]{3}.+?\))/g)
        let departureAirport

        if (airportEntries) {
            for (const entry of airportEntries) {
                if (entry.includes(whereFromAirport)) {
                    departureAirport = entry
                    logger.info(
                        'Successfully identified the desired departure airport.'
                    )
                    break
                }
            }
        }
        await page.getByText(departureAirport).click()
    }

    static async searchWhereTo(page, whereTo, whereToAirport) {
        await page.getByPlaceholder('Where to?').click()
        await page.getByPlaceholder('Where to?').fill(whereTo)
        await page.waitForTimeout(2000)
        const allFrom = await page
            .locator(homepageSelectors.dropdownSelector)
            .textContent()
        const airportEntries = allFrom.match(/([A-Z]{3}.+?\))/g)
        let returnAirport

        if (airportEntries) {
            for (const entry of airportEntries) {
                if (entry.includes(whereToAirport)) {
                    returnAirport = entry
                    logger.info(
                        'Successfully identified the desired return airport.'
                    )
                    break
                }
            }
        }
        await page.getByText(returnAirport).click()
    }

    static async selectDepartureDate(page, desiredDate?: string) {
        let desiredDepartureMonth, desiredDepartureDay

        if (desiredDate) {
            const dateObject = new Date(desiredDate)
            desiredDepartureMonth = dateObject.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
            })
            desiredDepartureDay = dateObject.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
            })
        } else {
            desiredDepartureMonth = Helpers.getDesiredDepartureMonth()
            desiredDepartureDay = Helpers.getDesiredDepartureDay()
        }
        let currentMonth

        await page.locator(homepageSelectors.departureDate).click()
        currentMonth = await page
            .locator(homepageSelectors.departureMonth)
            .textContent()
        while (currentMonth.trim() != desiredDepartureMonth) {
            console.log(currentMonth.trim(), desiredDepartureMonth)
            await page.click(homepageSelectors.rightIcon, { force: true })
            currentMonth = await page
                .locator(homepageSelectors.departureMonth)
                .textContent()
        }
        await page.getByLabel(desiredDepartureDay).click()
    }

    static async selectReturnDate(page, desiredDate?: string) {
        let desiredReturnMonth, desiredReturnDay

        if (desiredDate) {
            const dateObject = new Date(desiredDate)
            desiredReturnMonth = dateObject.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
            })
            desiredReturnDay = dateObject.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
            })
        } else {
            desiredReturnMonth = Helpers.getDesiredReturnMonth()
            desiredReturnDay = Helpers.getDesiredReturnDay()
        }
        let currentMonth

        await page.locator(homepageSelectors.returnDate).click()
        currentMonth = await page
            .locator(homepageSelectors.departureMonth)
            .textContent()
        while (currentMonth.trim() !== desiredReturnMonth) {
            await page.click(homepageSelectors.rightIcon, { force: true })
            currentMonth = await page
                .locator(homepageSelectors.departureMonth)
                .textContent()
            console.log(currentMonth)
        }
        await page.getByLabel(desiredReturnDay).click()
    }

    static async searchFlight(page) {
        await page.locator(homepageSelectors.searcHButton).click()
    }

    static async changeTravelWay(page, desiredWay) {
        const currentWay = await page
            .locator(homepageSelectors.oneWayOrRoundTrip)
            .textContent()
        if (currentWay === desiredWay) {
            logger.info(`Already on the desired way: ${desiredWay}`)
        } else {
            await page.locator(homepageSelectors.oneWayOrRoundTrip).click()
            switch (desiredWay) {
                case ONE_WAY:
                    await page.locator(homepageSelectors.oneWay).click()
                    break
                case ROUND_TRIP:
                    await page.locator(homepageSelectors.roundTrip).click()
                    break
                default:
                    throw new Error(`Invalid travel way: ${desiredWay}`)
            }
            logger.info(`Switched to the ${desiredWay} way.`)
        }
    }

    static async customizeFlightOptions(page, desiredClassType?: string) {
        await page.locator(homepageSelectors.travelDetails).click()
        this.changePassengerCount(
            page,
            testData.adultsCount,
            testData.childrenCount,
            testData.infantsCount
        )
        let classType
        if (desiredClassType) {
            classType = desiredClassType
            this.selectTravelClass(page, classType)
        } else {
            const classType: string = Helpers.getRandomClassType(CLASS_TYPES)
            this.selectTravelClass(page, classType)
        }
        await page.waitForTimeout(1000)
        this.getFlightDetailsAfterCustomization(
            page,
            testData.adultsCount,
            testData.childrenCount,
            testData.infantsCount,
            classType
        )
    }

    static async selectTravelClass(page, classText) {
        const travelClassSelector = homepageSelectors.travelClass.replace(
            '${classText}',
            classText
        )
        const travelClassOption = await page.locator(travelClassSelector)

        if (travelClassOption) {
            await travelClassOption.click()
            logger.info(`Selected to the ${classText}`)
        } else {
            logger.error(`Option with text '${classText}' not found.`)
        }
    }

    static async changePassengerCount(
        page,
        desiredAdultsCount,
        desiredChildrenCount,
        desiredInfantsCount
    ) {
        if (desiredAdultsCount > 9) {
            logger.error('Then number of adults should not exceed 9')
            return
        }
        if (desiredAdultsCount < desiredInfantsCount) {
            logger.error(
                'The number of adults should be equal to the number of infants'
            )
            return
        }
        if (desiredAdultsCount + desiredChildrenCount > 9) {
            logger.error(
                'The total number of passengers (adults + children) should not exceed 9'
            )
            return
        }
        const adultsSelector = homepageSelectors.adultsCount
        const childrenSelector = homepageSelectors.childrenCount
        const infantsSelector = homepageSelectors.infantsCount

        const adultCountDetails = await page
            .locator(adultsSelector)
            .textContent()
        const childrenCountDetails = await page
            .locator(childrenSelector)
            .textContent()
        const infantsCountDetails = await page
            .locator(infantsSelector)
            .textContent()

        const regex = /\)\s*(\d+)$/
        const adultsMatch = adultCountDetails.match(regex)
        const childrenMatch = childrenCountDetails.match(regex)
        const infantsMatch = infantsCountDetails.match(regex)

        if (!adultsMatch || !childrenMatch || !infantsMatch) {
            logger.error('Unable to determine the current count')
            return
        }

        let adultsCount = parseInt(adultsMatch[1])
        let childrenCount = parseInt(childrenMatch[1])
        let infantsCount = parseInt(infantsMatch[1])

        while (desiredAdultsCount !== adultsCount) {
            if (desiredAdultsCount > adultsCount) {
                await page
                    .locator(homepageSelectors.adultsCountIncrease)
                    .click()
            } else {
                await page
                    .locator(homepageSelectors.adultsCountDecrease)
                    .click()
            }

            const updatedDetails = await page
                .locator(adultsSelector)
                .textContent()
            const updatedMatch = updatedDetails.match(regex)
            if (!updatedMatch) {
                logger.error('Unable to determine the updated count')
                return
            }

            adultsCount = parseInt(updatedMatch[1])
            logger.info(`Updated count: ${adultsCount}`)
        }

        while (desiredChildrenCount !== childrenCount) {
            if (desiredChildrenCount > childrenCount) {
                await page
                    .locator(homepageSelectors.childrenCountIncrease)
                    .click()
            } else {
                await page
                    .locator(homepageSelectors.childrenCountDecrease)
                    .click()
            }

            const updatedDetails = await page
                .locator(childrenSelector)
                .textContent()
            const updatedMatch = updatedDetails.match(regex)
            if (!updatedMatch) {
                logger.error('Unable to determine the updated count')
                return
            }

            childrenCount = parseInt(updatedMatch[1])
            logger.info(`Updated count: ${childrenCount}`)
        }

        while (desiredInfantsCount !== infantsCount) {
            if (desiredInfantsCount > infantsCount) {
                await page
                    .locator(homepageSelectors.infantsCountIncrease)
                    .click()
            } else {
                await page
                    .locator(homepageSelectors.infantsCountDecrease)
                    .click()
            }

            const updatedDetails = await page
                .locator(infantsSelector)
                .textContent()
            const updatedMatch = updatedDetails.match(regex)
            if (!updatedMatch) {
                logger.error('Unable to determine the updated count')
                return
            }

            infantsCount = parseInt(updatedMatch[1])
            logger.info(`Updated count: ${infantsCount}`)
        }

        logger.info('Count is now equal to the final count.')
    }

    static async getFlightDetailsAfterCustomization(
        page,
        desiredAdultsCount,
        desiredChildrenCount,
        desiredInfantsCount,
        desiredClassType
    ) {
        const flightDetails = await page
            .locator(homepageSelectors.flightCustomizationDetails)
            .textContent()
        const expectedFlightDetails =
            Helpers.generateExpectedFlightDetailsTemplate(
                desiredAdultsCount,
                desiredChildrenCount,
                desiredInfantsCount,
                desiredClassType
            )
        expect(flightDetails).toBe(expectedFlightDetails)
    }

    static async searchFlightWithoutArrival(page) {
        await page.locator(homepageSelectors.searcHButton)
        const expectedMessage = await page
            .locator(homepageSelectors.searchWithoutArrival)
            .textContent()
        expect(expectedMessage).toBe(NO_ARRIVAL_ERROR_MESSAGE)
    }

    static async searchFlightWithoutDeparture(page) {
        await page.locator(homepageSelectors.searcHButton)
        const expectedMessage = await page
            .locator(homepageSelectors.searchWithoutDeparture)
            .textContent()
        expect(expectedMessage).toBe(NO_DEPARTURE_ERROR_MESSAGE)
    }

    static async searchFlightWithoutArrivalAndDeparture(page) {
        await page.locator(homepageSelectors.searcHButton)
        const expectedMessage = await page
            .locator(homepageSelectors.searchWithoutArrivalAndDeparture)
            .textContent()
        expect(expectedMessage).toBe(NO_ARRIVAL_DEPARTURE_ERROR_MESSAGE)
    }
}
