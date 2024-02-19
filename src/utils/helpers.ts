import logger from '@common/logger'

export class Helpers {
    static getCurrentMonthAndYear(): string {
        const currentDate = new Date()
        return currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
        })
    }

    static getDesiredDepartureMonth(): string {
        const currentDate = this.getCurrentMonthAndYear()
        return `${currentDate}`
    }

    static getDesiredReturnMonth(): string {
        return this.getDesiredDepartureMonth() // Assuming both are the same
    }

    static getDesiredDepartureDay(): string {
        const currentDate = new Date()
        const day = (currentDate.getDate() + 7).toString().padStart(2, '0') // Adding 7 days for return
        return `${currentDate.toLocaleString('en-US', { month: 'short' })} ${day}`
    }

    static getDesiredReturnDay(): string {
        const departureDate = new Date(this.getDesiredDepartureDay())
        const returnDate = new Date(
            departureDate.setDate(departureDate.getDate() + 7)
        )
        const day = returnDate.getDate().toString().padStart(2, '0')
        console.log(day)
        return `${returnDate.toLocaleString('en-US', { month: 'short' })} ${day}`
    }

    static getRandomClassType(classTypes) {
        const randomIndex: number = Math.floor(
            Math.random() * classTypes.length
        )
        return classTypes[randomIndex]
    }

    static generateExpectedFlightDetailsTemplate(
        adultsCount: number,
        childrenCount: number,
        infantsCount: number,
        classType: string
    ): string {
        const template = `${adultsCount} Adult${adultsCount !== 1 ? 's' : ''}, ${childrenCount} Child${childrenCount !== 1 ? 'ren' : ''}, ${infantsCount} Infant${infantsCount !== 1 ? 's' : ''}, ${classType}`
        return template
    }

    static async scrollUntilSelectorFound(page, selector) {
        for (let i = 0; i < 100; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight)
            })
        }

        const lazyLoadedElementSelector = selector
        await page.waitForSelector(lazyLoadedElementSelector, {
            timeout: 15000,
        })

        const lazyLoadedElementText = await page.$eval(
            lazyLoadedElementSelector,
            (element) => element.textContent.trim()
        )
        logger.info('Lazy-loaded element text:', lazyLoadedElementText)
    }

    static clickLowestPriceButton = async (page, lowestPriceIndex) => {
        if (lowestPriceIndex !== undefined) {
            const lowestPriceButtonXPath = `(//button[contains(normalize-space(),'Book')])[${lowestPriceIndex + 1}]`
            await page.click(lowestPriceButtonXPath)
            logger.info(
                `Clicked on the button for the lowest price at index ${lowestPriceIndex}`
            )
        }
    }
}
