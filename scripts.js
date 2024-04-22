// This script assumes the existence of an HTML element with id 'book-selection'
// and it attaches event listeners to handle changes in book selection.

document.addEventListener("DOMContentLoaded", function () {
  // Grabbing the book selection dropdown by its ID
  const bookSelection = document.getElementById("book-selection");
  bookSelection.addEventListener("change", function () {
    const isbn = this.value;
    if (!isbn) return; // If no ISBN is selected, exit the function
    fetchBookReviews(isbn); // Calling function to fetch reviews based on ISBN
  });
});

// Function to fetch book reviews using the Goodreads scraper API from Apify
function fetchBookReviews(isbn) {
  // Apify API setup
  const apifyToken = "apify_api_IrOK15cazcStRYKfYF4oKXi0kte1hl2yV4ZA";
  // Constructing the URL for the API request
  const datasetUrl = `https://api.apify.com/v2/acts/epctex~goodreads-scraper/run-sync-get-dataset-items?token=${apifyToken}`;
  // Payload to send with the POST request
  const payload = {
    url: `https://www.goodreads.com/book/isbn/${isbn}`,
    simplify: true, // This should be set according to the expected scraper output
  };

  // Making the API request to fetch data
  fetch(datasetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // Converting payload object to JSON string
  })
    .then((response) => response.json()) // Parsing the JSON response
    .then((data) => {
      displayBookReviews(data || []); // Handling the data via display function
    })
    .catch((error) => console.error("Error fetching reviews:", error)); // Error handling
}

// Function to display book reviews on the webpage
function displayBookReviews(reviews) {
  var reviewsContainer = document.getElementById("book-reviews");
  if (reviews.length > 0) {
    // Constructing HTML content with the reviews data
    reviewsContainer.innerHTML =
      "<h3>User Reviews:</h3>" +
      reviews.map((review) => `<p>${review.text}</p>`).join("");
  } else {
    // Displaying a message if no reviews are found
    reviewsContainer.innerHTML =
      "<h3>User Reviews:</h3><p>No reviews found.</p>";
  }
}
