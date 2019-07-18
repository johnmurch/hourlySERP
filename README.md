# Hourly SERP

## Based on a Tweet
[Tweet](https://twitter.com/TomekRudzki/status/1149643843324669953) posted up the following:
* Checking rankings every hour for a small set of keywords
* I want to known stats about ranking of all the URLs for a particular keyword. + Want to know exactly when page X outranks page Y.
* I want to check the exact time when a particular URL was indexed
* Easy exporting raw data to CSV/Excel
* Alert sent by email would be perfect


## Overview
* keywords.txt - one keyword per line
* cron-hourly.js - Node.js script that runs every hour to fetch SERP from API and save
* alerts.js - Node.js script that processes the alerts based on alerts.txt and data in ./db
* alerts.txt - alerts in one line alert per line format as follows:
```
keyword, http://link-you-WANT-to-rank-high, http://link-that-IS-ranking-high
```
Note: You can have as many alerts as you want, keep in mind it is based on keywords being searched and only compares the current hour to the last (or previous) hour.
* sample-responses - test files used to validate alerts and code
* utils.js - Node.js script of all the complexity and common snippets to make all this easy to understand

## RoadMap
@TODO
- Documentation
- Error handling
- Testing
- support Mailgun API
- S3 integration
- Allow for alerts to match domains and not just URLs

## Getting Started
1. Clone reports
2. Change keywords.txt
3. Change alerts.txt
4. Change move env_sample to .env and update API keys
5. Update cron-hourly.js API key and Mailgun API Key and (@todo) S3 Keys
6. Deploy to heroku
7. Setup heroku scheduler for every hour
8. Wait for Alerts or Review data on S3
9. ...
10. Profit$$$ jk 🤣


## Feedback/Thoughts/🤔
PRs Welcome or hit me up [@johnmurch](https://twitter.com/johnmurch)
