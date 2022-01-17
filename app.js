const puppeteer = require('puppeteer')
const mobile = puppeteer.devices['iPhone X']
const { exampleSites } = require('./src/exampleSites')
const fs = require('fs-extra')

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

(async () => {
    const browser = await puppeteer.launch({ defaultViewport: null })
    const page = await browser.newPage()

    for (let i = 0; i < exampleSites.length; i++) {

        const dir = `./screenshot/${exampleSites[i].name}`

        fs.ensureDirSync(dir);
        fs.ensureDirSync(`${dir}/desktop`);
        fs.ensureDirSync(`${dir}/mobile`);

        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(exampleSites[i].url, { waitUntil: 'load' })

        const bodyHandle = await page.$('body')
        const { height } = await bodyHandle.boundingBox()
        await bodyHandle.dispose()

        const viewportHeight = page.viewport().height
        let viewportIncr = 0
        while (viewportIncr + viewportHeight < height) {
            await page.evaluate(_viewportHeight => {
                window.scrollBy(0, _viewportHeight)
            }, viewportHeight)
            await wait(100)
            viewportIncr = viewportIncr + viewportHeight
        }

        await page.evaluate(_ => {
            window.scrollTo(0, 0)
        });

        await wait(200)

        await page.screenshot({ path: `./screenshot/${exampleSites[i].name}/desktop/lp.jpeg`, quality: 20, fullPage: true })

        console.log(`Site (desktop): ${i + 1} de ${exampleSites.length} capturados com sucesso!`)
    }

    await browser.close()

})();

(async () => {
    const browser = await puppeteer.launch({ defaultViewport: null })
    const page = await browser.newPage()

    for (let j = 0; j < exampleSites.length; j++) {

        await page.setViewport({ width: 1920, height: 1080 })
        await page.emulate(mobile)
        await page.setViewport({ width: 375, height: 812 })
        await page.goto(exampleSites[j].url, { waitUntil: 'load' })

        const bodyHandle = await page.$('body')
        const { height } = await bodyHandle.boundingBox()
        await bodyHandle.dispose()

        const viewportHeight = page.viewport().height
        let viewportIncr = 0
        while (viewportIncr + viewportHeight < height) {
            await page.evaluate(_viewportHeight => {
                window.scrollBy(0, _viewportHeight)
            }, viewportHeight)
            await wait(100)
            viewportIncr = viewportIncr + viewportHeight
        }

        await page.evaluate(_ => {
            window.scrollTo(0, 0)
        });

        await wait(200)

        await page.screenshot({ path: `./screenshot/${exampleSites[j].name}/mobile/lp.jpeg`, quality: 20, fullPage: true })

        console.log(`Site (mobile): ${j + 1} de ${exampleSites.length} capturados com sucesso!`)
    }

    await browser.close()

})()
