const { By, until } = require("selenium-webdriver");

async function goToOrders(driver) {

    console.log("Volviendo al inicio de la página...");

    await driver.executeScript(
        "window.scrollTo(0,0);"
    );

    await driver.sleep(1000);

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

    console.log("Buscando enlace Pedidos...");

    const links = await driver.findElements(By.css("a"));

    for (const link of links) {

        const text = (await link.getText()).trim();

        if (text === "Pedidos") {

            await link.click();

            console.log("Módulo Pedidos abierto.");

            break;

        }

    }

    await driver.sleep(1500);

    console.log("Buscando botón Nuevo pedido...");

    const buttons = await driver.findElements(By.css("button"));

    for (const button of buttons) {

        const text = (await button.getText()).trim();

        if (text === "Nuevo pedido") {

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                button
            );

            await driver.sleep(500);

            await button.click();

            console.log("Formulario Nuevo pedido abierto.");

            break;

        }

    }

    await driver.sleep(3000);

}

module.exports = {

    goToOrders

};