module.exports = (link, options, cookie, script, headlessType) => {
    let jsonLoad = {};
    jsonLoad.create = async () => {
        if ((script ?? "") === "") { // Fetch the tiktok-to-ytdlp script
            let req = await fetch("https://raw.githubusercontent.com/Dinoosauro/tiktok-to-ytdlp/main/script.js");
            script = await req.text();
        }
        if ((options ?? "") !== "") { // If the user has provided options
            let extraOptions = []; // A dobule array, that'll contain [["the property name", "and its values"]]
            for (let option in options) { // For each item in the object
                if (typeof options[option] === "object") { // If it's another object, do this loop again
                    for (let suboption in options[option]) {
                        extraOptions.push([`${option}=>${suboption}`, options[option][suboption]]); // Write also the main object
                    }
                } else extraOptions.push([option, options[option]]); // Not an object: automatically change property
            }
            script = script.replace("nodeElaborateCustomArgs()", `nodeElaborateCustomArgs(JSON.parse('${JSON.stringify(extraOptions)}'))`); // Adapt the script to change the custom options.
        }
        const puppeteer = require("puppeteer-extra"); // Improved Puppeteer
        const StealthPlugin = require('puppeteer-extra-plugin-stealth'); // Avoid detenction
        puppeteer.use(StealthPlugin());
        script = script.replace("isNode: false", "isNode: true"); // Say to the script that Node.JS is being used
        let browser = await puppeteer.launch({ headless: headlessType ?? "new"}); // Create a new Puppeteer
        let page = await browser.newPage();
        if ((cookie ?? "") !== "") await page.setCookie(...cookie); // Add passed cookies
        await Promise.all([
            page.goto(link),
            page.waitForSelector("[data-e2e=tiktok-logo]")
        ])
        async function checkIfUrl() { // Check if the page is loaded
            let isLoaded = typeof page.content === "function"; 
            if (isLoaded) isLoaded = await page.content().toString().replaceAll(" ", "").indexOf("<body>Pleasewait") === -1; // Look if the user must wait
            if (isLoaded) isLoaded = await page.evaluate(`document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2, .css-x6y88p-DivItemContainerV2").length !== 0`); // Look if there are any DivContainers
            if (!isLoaded) { // If one of the checks above failed, wait another 5 seconds.
                function wait() {
                    return new Promise((resolve) => {
                        setTimeout(async () => {
                            resolve(await checkIfUrl());
                        }, 5000);
                    })
                }
                await wait();
            }
            return true;
        };
        await checkIfUrl();
        return { // Return a new object that'll permit to start TikTok loading.
            start: async () => {
                let result = await page.evaluate(script);
                return result;
            },
            getUntil: async () => {
                let result = await page.evaluate("requestTxtNow()");
                return result;
            },
            close: async () => {
                await browser.close();
            }
        }
    }
    return jsonLoad;
}
