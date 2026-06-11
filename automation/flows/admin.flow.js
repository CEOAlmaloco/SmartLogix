const { login } = require("./login.flow");

async function loginAdmin(driver) {

    console.log("=================================");
    console.log("INICIANDO SESIÓN ADMIN");
    console.log("=================================");

    await login(

        driver,

        "sladmin@gmail.com",

        "admin123"

    );

    console.log("Administrador autenticado.");

    await driver.sleep(3000);

}

module.exports = {

    loginAdmin

};