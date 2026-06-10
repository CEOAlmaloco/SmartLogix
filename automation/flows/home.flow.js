const {By,until}=require("selenium-webdriver");

const selectors=require("../selectors/home.selectors");

async function home(driver){

    console.log("Inicio Home");

    await driver.wait(

        until.elementLocated(

            By.css(selectors.loginButton)

        ),

        10000

    );

    await driver.findElement(

        By.css(selectors.loginButton)

    ).click();

}

module.exports={

    home

};