//const { expect as expectChai } = require("chai");
//import { expect as expectChai } from 'chai'
const expectChai = require('chai').expect;

class Catalog {

    get productsList() { return $$("~store item text") }
    get product() { return $("(//android.view.ViewGroup[@content-desc=\"store item\"])[3]/android.view.ViewGroup[1]/android.widget.ImageView"); }
    get productName() {
        return $("//android.view.ViewGroup[@content-desc='container header']/android.widget.TextView")
    }
    get productPrice() { return $('~product price') }

    get addToCartBtn() { return $('~Add To Cart button') }

    get cartBadge() { return $('~cart badge') }

    async validateProduct(productName) {

        await this.product.waitForDisplayed({ timeout: 5000 });
        // get device dimensions
        const { height, width } = await driver.getWindowRect();

        console.log("height --> " + height + " width --> " + width)
        const startX = width / 2;
        const startY = height * 0.8;
        // const endX = width / 2;
        const endY = height * 0.25;
        console.log(startX, startY, endY)

        await driver.setImplicitTimeout(10000);
        let ProductCount = await this.productsList.length;
        console.log("ProductCount  --> " + ProductCount)

        // Find all product elements and loop through them to find the matching product

        for (let i = 0; i < ProductCount; i++) {
            const product = await this.productsList[i];
            const titleElement = await product.getText();
            console.log("Title --> " + titleElement)
            // const title = await titleElement.getText();
            if (titleElement === productName) {
                await product.click();
                break;
            }
            await driver.touchPerform([
                { action: 'press', options: { x: startX, y: startY } },
                { action: 'wait', options: { ms: 1000 } },
                { action: 'moveTo', options: { x: startX, y: endY } },
                { action: 'release', options: {} }

            ]);
        }

    }

    async validateProductDetails(name, price) {
        let actualProductName = await this.productName.getText();
        console.log("Name  ----> " + name)
        expectChai(actualProductName).to.be.equal(name);
        let productPrice = await this.productPrice.getText();
        let amount = await productPrice.match(/\$(\d+\.\d+)/)[1];
        console.log("extracted number ----> " + amount);
        expectChai(parseFloat(amount)).to.be.equal(price);
    }

    async validateProductFilter() {

    }

    async addToCart() {
        await this.addToCartBtn.waitForDisplayed();
        await this.addToCartBtn.click();
        await this.cartBadge.click();
    }

    async validateCartBadge(ExpcartCount) {
        await this.cartBadge.waitForDisplayed();
        let cartCount = await this.cartBadge.getText();
        console.log(cartCount);
        expectChai(parseInt(cartCount)).to.be.equal(ExpcartCount);
    }

}

module.exports = new Catalog();