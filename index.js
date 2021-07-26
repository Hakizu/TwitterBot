const parse = require('csv-parse/lib/sync')
const axios = require("axios")
const twit = require('twit')
require('dotenv').config()

const T = new twit({
    consumer_key: process.env.apiKey,
    consumer_secret: process.env.secretKey,
    access_token: process.env.accessToken,
    access_token_secret: process.env.accessTokenSecret,
})

const dashboardURL = "https://impfdashboard.de/static/data/germany_vaccinations_timeseries_v2.tsv"

async function getUrlData(url) {
    const urlStream = await axios.get(url)
    const tsvFileLines = parse(urlStream.data, {
        columns: true,
        skipEmptyLines: true,
        delimiter: '\t'
    })
    const lastLine = tsvFileLines.slice(-1)[0]
    return {
        date: lastLine.date,
        impf_quote_erst: lastLine.impf_quote_erst,
        impf_quote_voll: lastLine.impf_quote_voll
    }
}

function createProgressBar(percentage) {
    const chars = 15
    const filled = (percentage * chars).toFixed(2)
    const empty = chars - filled
    const calculdatedPercentage = (percentage * 100).toFixed(2)
        .toString().replace('.', ',')
    const progressBar = `${'▓'.repeat(filled)}${'░'.repeat(empty)} ${calculdatedPercentage}%`
    return progressBar
}

function createMessage(parsedData) {
    const firstBar = createProgressBar(parsedData?.['impf_quote_erst'])
    const secondBar = createProgressBar(parsedData?.['impf_quote_voll'])
    const message = `${firstBar} at least one dosis \n${secondBar} fully vaccinated`
    return message
}

function sendTweet(tweet) {
    T.post('statuses/update', { status: tweet})
        .then((response) => console.log(response.data.text, 'tweeted'))    
        .catch((error) => console.log(error, 'error'))
}

async function getLastTweet() {
    const lastTweet = await T.get('statuses/user_timeline', { count: 1, user_id: '1405058861703311361'})
        .catch((error) => console.log(error, 'error on getting tweet'))

    return lastTweet.data[0]
}

function checkIfShouldTweet(tweet, lastTweet) {
    const lastText = lastTweet.text
    return lastText !== tweet
}

async function runAll() {
    try {
        const data = await getUrlData(dashboardURL)
        const lastTweet = await getLastTweet()
        const tweet = createMessage(data)
        const shouldTweet = checkIfShouldTweet(tweet, lastTweet)
        if (shouldTweet) {
            sendTweet(tweet)
        } else {
            console.log("Don't tweet")
        }
    } catch(e) {
        console.log(e,'error on runAll')
    }
}

try {
    runAll()
} catch(e) {
    console.log(e, 'errored on try')
}