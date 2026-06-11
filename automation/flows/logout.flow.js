const { By, until } = require("selenium-webdriver");

async function logout(driver) {

    console.log("Abriendo menú de navegación...");

    const menuButton = await driver.wait(

        until.elementLocated(
            By.css("button[aria-label='Abrir menú de navegación']")
        ),

        10000

    );

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        menuButton
    );

    await driver.sleep(500);

    await menuButton.click();

    await driver.sleep(1000);

    console.log("Buscando botón Cerrar sesión...");

    const buttons = await driver.findElements(By.css("button"));

    for (const button of buttons) {

        const text = (await button.getText()).trim();

        if (text === "Cerrar sesión") {

            await button.click();

            console.log("Sesión cerrada correctamente.");

            break;

        }

    }

    await driver.sleep(3000);

}

module.exports = {

    logout

};
