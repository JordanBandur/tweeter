/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

const renderTweets = function(tweets) {
  $('#tweets-container').empty();
  tweets.forEach(tweet => {
    $('#tweets-container').prepend(createTweetElement(tweet));
  });
};

const createTweetElement = function(tweetData) {
  const $tweet = `
  <article class="tweet">
        <header>
          <div>
            <img src="${tweetData.user.avatars}" alt="Profile picture" class="profile-picture">
            <p class="name">${tweetData.user.name}</p>
          </div>
            <p class="username">${tweetData.user.handle}</p>
        </header>
        <p class="content">${tweetData.content.text}</p>
        <footer>
          <time>${tweetData.created_at}</time>
          <div>
          <i class="fa-solid fa-flag fa-2xs"></i>
          <i class="fa-solid fa-retweet fa-2xs"></i>
          <i class="fa-solid fa-heart fa-2xs"></i>
          </div>
        </footer>
      </article>
  `;
  return $tweet;
};

renderTweets(data);