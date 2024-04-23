$(() => {
  $("#tweet-text").on("input", function() {
    let textValue = $(this).val();  // Retrieves the current value of the textarea
    let charCount = textValue.length;
    let charLeft = 140 - charCount;

    let counter = $(this).closest('.container')  // Traverses up to a shared parent container
      .find('.counter')
      .text(charLeft);

    if (charLeft < 0) {
      $(counter).css('color', 'red');  // Change color to red if limit is exceeded
    } else if (charLeft <= 20) {
      $(counter).css('color', 'orange');  // Change color to orange if close to limit
    } else {
      $(counter).css('color', 'black');  // Reset color if within safe range
    }
  });
});

