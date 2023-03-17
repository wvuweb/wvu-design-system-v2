/**
  * This JS links @usernames, #hashtags, and links for tweet content in the
  * WVU Twitter Widget v3.
*/

const twitterWidget = (() => {
  'use strict';

  //
  // Variables:
  // --------------------------------------
  const getTweetContent = document.querySelectorAll('.js-tweet-content');

  //
  // Utilities:
  // --------------------------------------

  // Format HTML in tweets (@usernames, links, hashtags):
  // https://stackoverflow.com/questions/8020739/regex-how-to-replace-twitter-links
  // NOTE: modified some of the Regex's based on S.O. answers
  const processTweetLinks = (text) => {
    // Links:
    const linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    text = text.replace(linkExp, '<a href="$1">$1</a>');

    // Hashtags
    const hashtagExp = /(^|\s)#(\w+)/g;
    text = text.replace(hashtagExp, '$1<a href="https://twitter.com/hashtag/$2">#$2</a>');

    // Twitter usernames
    const usernameExp = /(^|\s)@(\w+)/g;
    text = text.replace(usernameExp, '$1<a href="https://twitter.com/$2">@$2</a>');

    return text;
  };

  //
  // Inits & Event Listeners:
  // --------------------------------------
  const init = () => {
    if (!getTweetContent?.length) return;
    for (const tweet of getTweetContent) {
      tweet.innerHTML = processTweetLinks(tweet.innerText);
    }
  };

  init();
})();
