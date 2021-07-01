# Impfstatus Update Twitter Bot

This is the code that runs the account [@impfupdate](https://twitter.com/impfupdate) on Twitter, tweeting German vaccination updates with an ASCII-art style loading bar, inspired by [@impf_progess](https://twitter.com/impf_progress). As a personal project I wanted to replicate [@impf_progress](https://twitter.com/impf_progress) which is originally written python, in JavaScript. Logic is partly the same and dependencies are
often js counterparts to the python used ones.

>▓▓▓▓▓▓▓▓░░░░░░ 55,10% at least one dosis 
>▓▓▓▓▓░░░░░░░░░ 37,30% fully vaccinated

## Script Setup

- Create an app at the [Twitter Developer site](https://developer.twitter.com/) and create app tokens and keys
- Set [Twit](https://www.npmjs.com/package/twit) config with consumer and access token/keys
- Make sure [state.yml](./state.yml) is writable, this is where the last Tweet and its values are stored so to not Tweet repeated messages
- Install the Twit, CSV and axios as dependencies

```
#Initialize node_modules
npm init

# Install dependencies
npm i twit
npm i csv-parser
npm i axios
```

The script can now be called like this:

```
node index.js
```

## Crontab Setup

Running a cronjob on mac

```
0 12 * * * . $HOME/.zprofile; /usr/local/bin/node /users/hakizu/documents/vscode/twitterbot/index.js
```

## Data Source

The script uses [germany_vaccinations_timeseries_v2.tsv](https://impfdashboard.de/static/data/germany_vaccinations_timeseries_v2.tsv) from [impfdashboard.de](https://impfdashboard.de/).

> Quelle: impfdashboard.de, RKI, BMG.

## License

MIT