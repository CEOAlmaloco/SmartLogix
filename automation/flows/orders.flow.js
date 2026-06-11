const { By, until } = require("selenium-webdriver");

async function goToOrders(driver) {

    console.log("Volviendo al inicio de la página...");

    await driver.executeScript("window.scrollTo(0,0);");
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

    await driver.sleep(1000);

    console.log("Completando datos del cliente...");

    const inputs = await driver.findElements(By.css("input"));

    await inputs[0].sendKeys("Cliente Demo");
    await inputs[1].sendKeys("cliente.demo@smartlogix.cl");

    const textarea = await driver.findElement(By.css("textarea"));

    await textarea.sendKeys(
        "Pedido generado automaticamente mediante Selenium."
    );

    console.log("Datos del cliente completados.");

    await driver.sleep(1000);

    console.log("Abriendo selector de items...");

    const selectorButtons = await driver.findElements(By.css("button"));

    for (const button of selectorButtons) {

        const text = (await button.getText()).trim();

        if (text === "+ Agregar ítem") {

            await button.click();

            console.log("Selector de items abierto.");

            break;

        }

    }

    await driver.sleep(1000);

    console.log("Agregando productos al pedido...");

    let agregados = 0;

    while (agregados < 3) {

        // Buscar nuevamente los botones cada vez
        const addButtons = await driver.findElements(
            By.xpath("//button[normalize-space()='Agregar']")
        );

        if (addButtons.length === 0) {
            break;
        }

        // Siempre utilizar el primer botón disponible
        const button = addButtons[0];

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            button
        );

        await driver.sleep(300);

        await button.click();

        agregados++;

        console.log(`Producto ${agregados} agregado.`);

        await driver.sleep(1000);

    }

    console.log("Creando pedido...");

    const createButtons = await driver.findElements(
        By.xpath("//button[normalize-space()='Crear pedido']")
    );

    if (createButtons.length > 0) {

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            createButtons[0]
        );

        await driver.sleep(500);

        await createButtons[0].click();

        console.log("Pedido creado correctamente.");

    } else {

        console.log("No se encontró el botón Crear pedido.");

    }

    await driver.sleep(3000);

    console.log("Buscando tabla de pedidos...");

    // Buscar el contenedor con scroll horizontal
    const scrollContainer = await driver.findElement(
        By.css("div[style*='overflow'], .tableContainer, .tableWrapper")
    ).catch(() => null);

    if (scrollContainer) {

        console.log("Desplazando tabla hacia la derecha...");

        await driver.executeScript(
            "arguments[0].scrollLeft = arguments[0].scrollWidth;",
            scrollContainer
        );

    } else {

        // Si no existe un contenedor específico, desplazar la ventana.
        await driver.executeScript(
            "window.scrollBy(1000,0);"
        );

    }

    await driver.sleep(1000);

    console.log("Buscando botón Cambiar estado...");

    const actionButtons = await driver.findElements(By.css("button"));

    for (const button of actionButtons) {

        const text = (await button.getText()).trim();

        if (text === "Cambiar estado") {

            await driver.executeScript(
                "arguments[0].scrollIntoView({block:'center',inline:'center'});",
                button
            );

            await driver.sleep(500);

            await button.click();

            console.log("Estado cambiado correctamente.");

        break;

    }

}

await driver.sleep(3000);

}

module.exports = {

    goToOrders

};