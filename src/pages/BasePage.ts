import { Page } from 'playwright-core'

export class BasePage {
    static async open(page: Page, url: string): Promise<void> {
        await page.goto(url)
    }

    static async getTitle(page: Page): Promise<string> {
        return page.title()
    }
}
