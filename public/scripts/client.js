/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {
  const $tweetsContainer = $('#tweets-container');
  const $form = $('.new-tweet form');

  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      success: (tweets) => {
        renderTweets(tweets);
      },
      error: (err) => {
        console.error('Failed to load tweets:', err);
      }
    });
  };

  const renderTweets = function(tweets) {
    $tweetsContainer.empty();
    tweets.forEach(tweet => {
      $tweetsContainer.prepend(createTweetElement(tweet));
    });
  };

  // prevents Cross-Site Scripting (XSS). Used AI to get common characters used in XSS attacks
  const escapeHTML = function(str) {
    // Uses the replace method on the string to search for special HTML characters
    // The /[&<>"']/g is a regular expression that matches characters that need escaping in HTML
    return str.replace(/[&<>"']/g, function(match) {

      switch (match) { // will replace character with it's HTML equivalent
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
      }
    });
  };

  const createTweetElement = function(tweetData) {
    const formattedTime = timeago.format(new Date(tweetData.created_at)); // Using timeago.js to format the timestamp
    const $tweet = $(`
    <article class="tweet">
          <header>
            <div>
              <img src="${escapeHTML(tweetData.user.avatars)}" alt="Profile picture" class="profile-picture">
              <p class="name">${escapeHTML(tweetData.user.name)}</p>
            </div>
              <p class="username">${escapeHTML(tweetData.user.handle)}</p>
          </header>
          <p class="content">${escapeHTML(tweetData.content.text)}</p>
          <footer>
            <time>${formattedTime}</time>
            <div>
            <i class="fa-solid fa-flag fa-2xs"></i>
            <i class="fa-solid fa-retweet fa-2xs"></i>
            <i class="fa-solid fa-heart fa-2xs"></i>
            </div>
          </footer>
        </article>
    `);
    return $tweet;
  };

  const isTweetValid = function(tweetText) {

    if (!tweetText) {
      alert("Error: Tweet cannot be empty!");
      return false;
    }

    if (tweetText.length > 140) {
      alert("Error: Tweet exceeds the 140 character limit.");
      return false;
    }

    return true;
  };

  $form.on('submit', (event) => {
    event.preventDefault();
    const tweetText = $form.find('textarea[name="text"]').val().trim();

    if (!isTweetValid(tweetText)) {
      return;
    }

    const data = $form.serialize();

    // POST the data to the server
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: data,
      success: () => {
        console.log('tweet POST was a success');
        $form.find('textarea[name="text"]').val('');
        loadTweets();
      },
      error: (err) => {
        console.error('Error posting tweet:', err);
      }
    });
  });

  loadTweets();
});
