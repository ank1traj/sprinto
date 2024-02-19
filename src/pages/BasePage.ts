export class BasePage {
    static async open(page, url) {
        await page.goto(url)
    }

    static async getTitle(page) {
        return page.title()
    }
}
