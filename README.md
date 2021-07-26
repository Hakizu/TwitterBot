# 2.0 Impfupdate Twitter Bot
This Twitter bot has been updated to version 2.0.
Instead of using a local file to save previous data the bot checks the latest tweet on his timeline and compares it
to the createdTweet to ensure it's always up to date.

By not depending on a local file it enables the code to be deployed on [Pipedream](https://pipedream.com/).
Pipedream is able to run the script remotely, checking several times a day to ensure it always tweets
the newest Impfdashboard as soon as possible, even on weekends.


## Impfupdate Twitter Bot

This is the code that runs the account [@impfupdate](https://twitter.com/impfupdate) on Twitter, tweeting German vaccination updates with an ASCII-art style loading bar, inspired by [@impf_progess](https://twitter.com/impf_progress).\
I wanted to replicate [@impf_progress](https://twitter.com/impf_progress) as a personal project which is originally written python, in JavaScript. Logic is partly the same and dependencies are often js counterparts to the python used ones.

>▓▓▓▓▓▓▓▓░░░░░░ 55,10% at least one dosis\
>▓▓▓▓▓░░░░░░░░░ 37,30% fully vaccinated

## Script Setup

- Create an app at the [Twitter Developer site](https://developer.twitter.com/) and create app tokens and keys
- Set [Twit](https://www.npmjs.com/package/twit) config with consumer and access token/keys
- Install the Twit, CSV and axios as dependencies

```
#Initialize node_modules
npm init

# Install dependencies
npm i
```

The script can now be called like this:

```
node index.js
```

## Crontab Setup

New cronjob deployed on Pipedream
```
0 11-18 * * *
```

## Data Source

The script uses [germany_vaccinations_timeseries_v2.tsv](https://impfdashboard.de/static/data/germany_vaccinations_timeseries_v2.tsv) from [impfdashboard.de](https://impfdashboard.de/).

> Quelle: impfdashboard.de, RKI, BMG.

## License

MIT