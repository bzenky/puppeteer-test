const puppeteer = require('puppeteer')
const mobile = puppeteer.devices['iPhone X']

const exampleSites = [
    {
        name: 'Mercado Livre',
        url: 'http://mercadolivre.com.br',
    },
    {
        name: 'Amazon AWS',
        url: 'https://aws.amazon.com/',
    },
    {
        name: 'Vercel',
        url: 'http://vercel.com',
    },
]

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

(async () => {
    const browser = await puppeteer.launch({ defaultViewport: null })
    const page = await browser.newPage()

    for (let i = 0; i < exampleSites.length; i++) {

        await page.setViewport({ width: 1920, height: 1080, setDeviceScaleFactor: 0.75 })
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

        await page.screenshot({ path: `./screenshot/${exampleSites[i].name}-desktop.jpeg`, quality: 20, fullPage: true })

        await page.emulate(mobile)
        await page.screenshot({ path: `./screenshot/${exampleSites[i].name}-mobile.jpeg`, quality: 20, fullPage: true })
    }

    await browser.close()
})()
