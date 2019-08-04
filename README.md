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


## Getting Started
1. Clone reports - ``` git clone https://github.com/johnmurch/hourlySERP.git ```
2. Change keywords.txt
3. Change alerts.txt
4. Signup at [https://scrapeulous.com](https://scrapeulous.com) and get an API key
5. Move env_sample to .env and update API keys
6. npm install
7. npm start // Note you will need to remember to run every hour or setup a cron
8. Setup cron for each hour on cron-hourly.js
9. Setup cron fro each hour on alerts.js
10. Wait for emails or review data

## Feedback/Thoughts/🤔
PRs Welcome or hit me up [@johnmurch](https://twitter.com/johnmurch)
