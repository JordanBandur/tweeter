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
    $('#tweets-container').empty();
    tweets.forEach(tweet => {
      $('#tweets-container').prepend(createTweetElement(tweet));
    });
  };

  const createTweetElement = function(tweetData) {
    const formattedTime = timeago.format(new Date(tweetData.created_at)); // Using timeago.js to format the timestamp
    const $tweet = $(`
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

  $form.on('submit', (event) => {
    event.preventDefault();
    const data = $form.serialize();

    // POST the data to the server
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: data,
      success: () => {
        console.log('tweet POST was a success');
        loadTweets();
      },
      error: (err) => {
        console.error('Error posting tweet:', err);
      }
    });
  });

  loadTweets();
});
