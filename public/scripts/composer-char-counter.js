$(() => {
  $("#tweet-text").on("input", function() {
    let textValue = $(this).val();  // Retrieves the current value of the textarea
    let charCount = textValue.length;
    let charLeft = 140 - charCount;

    let counter = $(this).closest('.container')  // Traverses up to a shared parent container
      .find('.counter')
      .text(charLeft);

    counter.removeClass('counter-safe counter-warning counter-exceeded');

    if (charLeft < 0) {
      // When the characters exceed the limit
      counter.addClass('counter-exceeded');
    } else if (charLeft <= 20) {
      // When the character count is close to the limit
      counter.addClass('counter-warning');
    } else {
      // When within safe range
      counter.addClass('counter-safe');
    }

  });

  // Initialize on page load for any pre-filled values
  $("#tweet-text").trigger('input');
  
});

