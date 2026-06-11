const { Builder } = require("selenium-webdriver");

require("chromedriver");

const credentials = require("./config/credentials");

const { acceptCookies } = require("./flows/cookies.flow");
const { home } = require("./flows/home.flow");
const { login } = require("./flows/login.flow");
const { goToInventory } = require("./flows/inventory.flow");
const { goToOrders } = require("./flows/orders.flow");
const { goToShipments } = require("./flows/shipments.flow");

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

        // Inventario
        await goToInventory(driver);

        console.log("Inventario completado correctamente.");

        // Pedidos
        await goToOrders(driver);

        console.log("Pedidos completado correctamente.");

        // Envíos
        await goToShipments(driver);

        console.log("Envíos completado correctamente.");

        console.log("=================================");
        console.log("FLUJO PYME FINALIZADO");
        console.log("=================================");


        const { logout } = require("./flows/logout.flow");
        const { loginAdmin } = require("./flows/admin.flow");

        await logout(driver);

        console.log("Sesión PYME finalizada.");

        await loginAdmin(driver);

        console.log("Vista Administrador cargada.");

        console.log("=================================");
        console.log("DEMOSTRACIÓN FINALIZADA");
        console.log("=================================");   

    } catch (error) {

        console.error("Error durante la demostración:");
        console.error(error);

    }

    // Por ahora dejamos el navegador abierto para verificar visualmente.
    // Cuando toda la demostración esté lista se puede utilizar:
    //
    // finally {
    //     await driver.quit();
    // }

}

demo();