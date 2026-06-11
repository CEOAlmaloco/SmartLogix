const { By, until } = require("selenium-webdriver");

async function goToShipments(driver) {

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

    console.log("Buscando módulo Envíos...");

    const links = await driver.findElements(By.css("a"));

    for (const link of links) {

        const text = (await link.getText()).trim();

        if (text === "Envios") {

            await link.click();

            console.log("Módulo Envíos abierto.");

            break;

        }

    }

    await driver.sleep(1500);

    console.log("Buscando botón Nuevo envío...");

    const buttons = await driver.findElements(By.css("button"));

    for (const button of buttons) {

        const text = (await button.getText()).trim();

        if (text === "Nuevo envío") {

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                button
            );

            await driver.sleep(500);

            await button.click();

            console.log("Formulario Nuevo envío abierto.");

            break;

        }

    }

    await driver.sleep(1000);

    console.log("Completando formulario de envío...");

    const inputs = await driver.findElements(By.css("input"));

    const tracking = `TRACK-${Date.now()}`;

    // Transportista
    await inputs[0].sendKeys("Transportes SmartLogix");

    // Código Tracking
    await inputs[1].sendKeys(tracking);

    // El input fecha ya viene con un valor por defecto.
    // Lo dejamos tal como está.

    console.log("Formulario completado.");

    await driver.sleep(1000);

    console.log("Creando envío...");

    const submitButtons = await driver.findElements(
        By.xpath("//button[normalize-space()='Crear envío']")
    );

    if (submitButtons.length > 0) {

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            submitButtons[0]
        );

        await driver.sleep(500);

        await submitButtons[0].click();

        console.log("Envío creado correctamente.");

    } else {

        console.log("No se encontró el botón Crear envío.");

    }

    await driver.sleep(3000);

}

module.exports = {

    goToShipments

};