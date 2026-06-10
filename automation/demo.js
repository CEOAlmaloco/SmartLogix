const { Builder } = require("selenium-webdriver");

require("chromedriver");

const credentials = require("./config/credentials");

const { acceptCookies } = require("./flows/cookies.flow");
const { home } = require("./flows/home.flow");
const { login } = require("./flows/login.flow");
const { goToInventory } = require("./flows/inventory.flow");

async function demo() {

    const driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {

        console.log("=================================");
        console.log("INICIANDO DEMOSTRACIÓN");
        console.log("=================================");

        console.log("Abriendo SmartLogix...");
        await driver.get(credentials.baseUrl);

        await acceptCookies(driver);

        await home(driver);

        await login(
            driver,
            credentials.pyme.email,
            credentials.pyme.password
        );

        console.log("Login realizado correctamente.");

        // Ir al módulo Inventario
        await goToInventory(driver);

        console.log("Inventario abierto correctamente.");

        const { goToOrders } = require("./flows/orders.flow");

        await goToOrders(driver);

        console.log("Pedidos abierto correctamente.");

    } catch (error) {

        console.error("Error durante la demostración:");
        console.error(error);

    }

    // Por ahora dejamos el navegador abierto.

}

demo();