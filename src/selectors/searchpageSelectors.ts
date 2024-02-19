export const searchpageSelectors = {
    errorMessage: "//h3[contains(@class,'lh-title')]",
    tryAgainMessage: "//p[contains(@class,'lh-copy')]",
    stickyParent: "div.sticky__parent",
    departurePrice: "(//span[@class='fs-inherit c-inherit mr-1 fw-500'][normalize-space()='Price'])[1]",
    returnPrice: "(//span[@class='fs-inherit c-inherit mr-1 fw-500'][normalize-space()='Price'])[2]",
    bookNowButton: "//span[contains(text(), 'Book now')]",
    allOneWayFlight: "//*[@data-testid='airlineBlock']",
}