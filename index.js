const parse = require('csv-parse/lib/sync')
const axios = require("axios")
const twit = require('twit')
require('dotenv').config()
const fs = require('fs')

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
    T.post('statuses/update', { status: tweet}, 
        function(err){
            if (err) {
                console.log(err, 'error')
                return
            }
            console.log(tweet, 'tweeted')
        } 
    )
}

function checkIfShouldTweet(data) {
    const configJSON = fs.readFileSync("/Users/hakizu/Documents/VSCode/TwitterBot/state.yml", "utf-8")
    const config = JSON.parse(configJSON)
    return data.date !== config.date
}

function saveState(data) {    
    fs.writeFile("/Users/hakizu/Documents/VSCode/TwitterBot/state.yml", JSON.stringify(data), function(err) {
        if (err) throw err
    })
}

async function runAll() {
    try {
        const data = await getUrlData(dashboardURL)
        const shouldTweet = checkIfShouldTweet(data)
        if (shouldTweet) {
            const tweet = createMessage(data)
            sendTweet(tweet)
        } else {
            console.log("Don't tweet")
        }
        saveState(data)
    } catch(e) {
        console.log(e,'error on runAll')
    }
}

try {
    runAll()
}catch(e) {
    console.log(e, 'errored on try')
}