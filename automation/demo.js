const { Builder } = require("selenium-webdriver");

require("chromedriver");

const credentials = require("./config/credentials");

const { acceptCookies } = require("./flows/cookies.flow");
const { home } = require("./flows/home.flow");
const { login } = require("./flows/login.flow");
const { goToInventory } = require("./flows/inventory.flow");
const { goToOrders } = require("./flows/orders.flow");
const { goToShipments } = require("./flows/shipments.flow");
const { logout } = require("./flows/logout.flow");
const { loginAdmin } = require("./flows/admin.flow");

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

        console.log("✓ Login realizado correctamente.");

        // Pausa para explicar el login
        await driver.sleep(2000);

        // Inventario
        await goToInventory(driver);

        console.log("✓ Inventario completado correctamente.");

        // Pausa para explicar creación de item
        await driver.sleep(1500);

        // Pedidos
        await goToOrders(driver);

        console.log("✓ Pedido creado correctamente.");

        // Pausa para explicar creación del pedido
        await driver.sleep(2000);

        // Envíos
        await goToShipments(driver);

        console.log("✓ Envío creado correctamente.");

        // Pausa para explicar creación del envío
        await driver.sleep(2000);

        console.log("=================================");
        console.log("FLUJO PYME FINALIZADO");
        console.log("=================================");

        // Pequeña pausa antes del cambio de usuario
        await driver.sleep(1500);

        await logout(driver);

        console.log("✓ Sesión PYME finalizada.");

        // Pausa para explicar cambio de rol
        await driver.sleep(1500);

        await loginAdmin(driver);

        console.log("✓ Vista Administrador cargada.");

        // Dejar visible el panel administrador
        await driver.sleep(2500);

        console.log("=================================");
        console.log("DEMOSTRACIÓN FINALIZADA");
        console.log("=================================");

    } catch (error) {

        console.error("Error durante la demostración:");
        console.error(error);

    }

    // Dejamos el navegador abierto para la presentación.

}

demo();