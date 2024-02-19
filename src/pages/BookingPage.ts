import { expect } from '@playwright/test'
import logger from '@common/logger'
import { ITINERARY_MESSAGE } from '@common/constants'
import { bookingpageSelectors } from 'selectors/bookingpageSelectors'

export class BookingPage {
    static async viewBookingPage(page) {
        try {
            const reviewItineraryMessage = await page.textContent(
                bookingpageSelectors.reviewItinerary
            )

            expect(reviewItineraryMessage).toBe(ITINERARY_MESSAGE)

            logger.info(
                `Review itinerary message verified: "${ITINERARY_MESSAGE}"`
            )
        } catch (error) {
            logger.error(`Error in viewBookingPage function: ${error.message}`)
            throw error
        }
    }
}
