/**
  Show tweets in a custom format with Twitter Fetcher:
  https://github.com/jasonmayes/Twitter-Post-Fetcher

  This JavaScript uses the `dataOnly` API and outputs a custom HTML template for tweets.
*/

/* global twitterFetcher */

const showTweets = (() => {
  'use strict';

  // Utility function: get relative time string:
  // https://gist.github.com/LewisJEllis/9ad1f35d102de8eee78f6bd081d486ad
  const getRelativeTimeString = (date, lang = 'en') => {
    const timeMs = typeof date === 'number' ? date : date.getTime();
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
    const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
  };

  // Variables:
  const getTwitterHandle = document.querySelector('[data-js-twitter-handle]').dataset.jsTwitterHandle;
  const wvuConfig = {
    customCallback: renderTweets,
    dataOnly: true,
    domId: 'js-twitter-container',
    enableLinks: true,
    lang: 'en',
    maxTweets: 4,
    profile: {
      screenName: getTwitterHandle
    },
    showImages: false,
    showInteraction: false,
    showUser: false,
    showTime: true
  };

  // NOTE: Callback function to add an aria-label to "Post on" links to avoid duplicate link text
  function renderTweets (tweets) {
    const element = document.getElementById(wvuConfig.domId);
    let n = 0;
    let listItems = '';
    while (n < tweets.length) {
      const tweetDate = new Date(`${tweets[n].timestamp}`);
      const relativeTime = getRelativeTimeString(tweetDate);
      listItems += `
        <li class="wvu-tweets__individual-tweet col-sm-6 col-lg-3 mb-3 mb-lg-0">
          <p class="wvu-tweets__tweet-content">${tweets[n].tweet}</p>
          <p class="wvu-tweets__time-posted small">
            <a class="wvu-tweets__permalink" href="${tweets[n].permalinkURL}" title="${tweets[n].timestamp}" aria-label="Permalink to tweet #${n + 1} posted ${relativeTime}">
              Posted <time datetime="${tweets[n].timestamp}">${relativeTime}</time>
            </a>
          </p>
        </li>
      `;
      n++;
    }

    // NOTE: Create `<ul>` to house list items:
    const unorderedList = document.createElement('ul');
    unorderedList.classList.add('wvu-tweets__list', 'row', 'list-unstyled', 'mb-0');
    unorderedList.innerHTML = listItems;

    // NOTE: Add `.text-break` to links in tweet text:
    const getAnchors = unorderedList.querySelectorAll('.wvu-tweets__tweet-content a');
    for (const anchor of getAnchors) {
      anchor.classList.add('text-break');
    }

    element.innerHTML = ''; // NOTE: Clear the loader.
    element.appendChild(unorderedList);
  }

  twitterFetcher.fetch(wvuConfig);
})();
