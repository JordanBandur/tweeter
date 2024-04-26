/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Ensure all operations only run once the document is fully loaded
$(() => {
  const $tweetsContainer = $('#tweets-container');
  const $form = $('.new-tweet form');

  // Toggle visibility of the new tweet section when clicking on the fa-angles-down icon
  $('#toggle-tweet').on('click', () => {
    const $newTweetSection = $('.new-tweet');

    // Check if the new tweet section is visible
    if ($newTweetSection.is(':visible')) {
      $newTweetSection.slideUp(); // Use jQuery's slideUp to hide the section with an animation
    } else {
      $newTweetSection.slideDown(); // Use jQuery's slideDown to show the section with an animation
      $('#tweet-text').focus(); // Automatically focus the textarea after showing the section
    }
  });

  // Check if page is scrolled more than 200 pixels
  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });

  // Click event to scroll to top
  $('#back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

  // Function to fetch tweets from the server via GET request
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

  // Function to render tweets to the DOM
  const renderTweets = function(tweets) {
    $tweetsContainer.empty(); // Clear the container before adding new tweets
    tweets.forEach(tweet => {
      $tweetsContainer.prepend(createTweetElement(tweet));
    });
  };

  // Clear the container before adding new tweets
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

  // Function to create and return a tweet element based on provided tweet data
  const createTweetElement = function(tweetData) {

    // Format the creation time of the tweet using timeago.js for relative time
    const formattedTime = timeago.format(new Date(tweetData.created_at));

    const $tweet = $(`
    <article class="tweet">
          <header>
            <div>
              <img src="${tweetData.user.avatars}" alt="Profile picture" class="profile-picture">
              <p class="name">${tweetData.user.name}</p>
            </div>
              <p class="username">${tweetData.user.handle}</p>
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

  // Check if the tweet text is empty and display error if so
  const isTweetValid = function(tweetText) {
    const $errorMessage = $('#error-message');

    if (!tweetText) {
      $errorMessage.text("Error: Tweet cannot be empty!").show();
      return false;
    }

    if (tweetText.length > 140) {
      $errorMessage.text("Error: Tweet exceeds the 140 character limit.").show();
      return false;
    }

    $errorMessage.hide();
    return true;
  };

  // Event handler for form submission to post a new tweet
  $form.on('submit', (event) => {
    event.preventDefault();
    const tweetText = $form.find('textarea[name="text"]').val().trim();

    // Validate the tweet text, and return early if invalid
    if (!isTweetValid(tweetText)) {
      return;
    }

    const data = $form.serialize(); // Serialize the form data for POST request

    // POST the data to the server
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: data,
      success: () => {
        console.log('tweet POST was a success');
        $('#error-message').hide();
        $form.find('textarea[name="text"]').val(''); // Clear the text area
        $form.find('output[name="counter"]').text(140); // Reset the character counter
        loadTweets(); // Reload the tweets to display the new one
      },
      error: (err) => {
        console.error('Error posting tweet:', err);
      }
    });
  });

  // Initial call to load tweets and populate the list
  loadTweets();
});
