const { By, until } = require("selenium-webdriver");

const selectors = require("../selectors/auth.selectors");

async function login(driver, email, password) {

    console.log("Esperando formulario de login...");

    await driver.wait(
        until.elementLocated(By.css(selectors.email)),
        10000
    );

    await driver.wait(
        until.elementLocated(By.css(selectors.password)),
        10000
    );

    await driver.wait(
        until.elementLocated(By.css(selectors.submit)),
        10000
    );

    console.log("Ingresando email...");
    await driver.findElement(
        By.css(selectors.email)
    ).sendKeys(email);

    console.log("Ingresando contraseña...");
    await driver.findElement(
        By.css(selectors.password)
    ).sendKeys(password);

    console.log("Enviando formulario...");
    await driver.findElement(
        By.css(selectors.submit)
    ).click();

    console.log("Esperando redirección al dashboard...");

    await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url.includes("/dashboard");
    }, 10000);

    console.log("Login completado correctamente.");

}

module.exports = {

    login

};