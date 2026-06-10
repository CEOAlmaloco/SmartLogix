const { By, until } = require("selenium-webdriver");

async function goToInventory(driver) {

    console.log("Buscando enlace Ir a Inventario...");

    const links = await driver.wait(
        until.elementsLocated(By.css("a")),
        10000
    );

    for (const link of links) {

        const text = (await link.getText()).trim();

        if (text === "Ir a Inventario") {

            await link.click();

            console.log("Inventario abierto.");

            break;

        }

    }

    await driver.sleep(1000);

    console.log("Buscando botón Agregar item...");

    const buttons = await driver.findElements(By.css("button"));

    for (const button of buttons) {

        const text = (await button.getText()).trim();

        if (text === "Agregar item") {

            await button.click();

            console.log("Formulario abierto.");

            break;

        }

    }

    await driver.sleep(1000);

    console.log("Completando formulario...");

    const inputs = await driver.findElements(By.css("input"));

    const sku = `DEMO-${Date.now()}`;

    await inputs[0].sendKeys("Producto Demo");

    await inputs[1].sendKeys(sku);

    await inputs[2].clear();
    await inputs[2].sendKeys("100");

    await inputs[3].clear();
    await inputs[3].sendKeys("5000");

    await inputs[4].clear();
    await inputs[4].sendKeys("Principal");

    console.log("Formulario completado.");

    console.log("Guardando producto...");

    const submitButton = await driver.findElement(
        By.css("button[type='submit']")
    );

    await driver.executeScript(
        "arguments[0].scrollIntoView({ block: 'center' });",
        submitButton
    );

    await driver.sleep(500);

    await submitButton.click();

    console.log("Producto agregado correctamente.");

    // Pausa para visualizar el resultado
    await driver.sleep(3000);

}

module.exports = {

    goToInventory

};