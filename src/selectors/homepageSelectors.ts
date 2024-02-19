export const homepageSelectors = {
    dropdownSelector: "//div[contains(@class, 'dropdown p-absolute')]",
    departureDate: '.homeCalender button:first-child',
    returnDate: '.homeCalender button:last-child',
    departureMonth: "(//div[@class='DayPicker-Caption'])[position() = 1]",
    rightIcon: "//div[@class='flex-1 ta-right']//*[name()='svg']",
    searcHButton: '.home-search-btn',
    oneWayOrRoundTrip: "//div[@class='p-relative']//button",
    oneWay: "//li[@value='oneway']",
    roundTrip: "//li[@value='rt']",
    travelDetails: "//div[@class='p-relative br-4']",
    travelClass: "//div[@class='mt-6 px-3']/div[text()='${classText}']",
    adultsCount:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][1]",
    childrenCount:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][2]",
    infantsCount:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][3]",
    adultsCountDecrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][1]//li[@class='flex-inline ']",
    adultsCountIncrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][1]//li[@class='flex-inline']",
    childrenCountDecrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][2]//li[@class='flex-inline ']",
    childrenCountIncrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][2]//li[@class='flex-inline']",
    infantsCountDecrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][3]//li[@class='flex-inline ']",
    infantsCountIncrease:
        "//div[@value='travellerAndClass']//div//div[contains(@class,'ls-reset')][3]//li[@class='flex-inline']",
    flightCustomizationDetails:
        "//span[contains(@class, 'fw-500') and contains(text(), 'Adults') and contains(text(), 'Children') and contains(text(), 'Infant')]",
    searchWithoutDeparture:
        "//span[contains(text(), 'Enter departure airport / city')]",
    searchWithoutArrival:
        "//span[contains(text(), 'Enter arrival airport / city')]",
    searchWithoutArrivalAndDeparture:
        "//span[contains(text(), 'Enter departure and arrival airports / cities')]",
}
