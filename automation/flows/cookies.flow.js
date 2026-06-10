const { By, until } = require("selenium-webdriver");

async function acceptCookies(driver) {

    console.log("Buscando banner de cookies...");

    const button = await driver.wait(

        until.elementLocated(

            By.xpath("//button[text()='OK']")

        ),

        10000

    );

    console.log("Aceptando cookies...");

    await button.click();

    console.log("Cookies aceptadas.");

}

module.exports = {

    acceptCookies

};