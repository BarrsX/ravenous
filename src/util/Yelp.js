const Yelp = {
  search(term, location, sortBy) {
    return (
      fetch(
        `https://morning-stream-08762.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}&limit=48`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
          },
        }
      )
        .then((response) => {
          // Add check for successful response
          if (!response.ok) {
            // Throw an error or return a specific error object/message
            // Returning an empty array for simplicity here, but could be more specific
            console.error(`HTTP error! status: ${response.status}`);
            return []; // Or throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((jsonResponse) => {
          if (jsonResponse.businesses) {
            return jsonResponse.businesses.map((business) => {
              return {
                id: business.id,
                imageSrc: business.image_url,
                name: business.name,
                address: business.location.address1,
                city: business.location.city,
                state: business.location.state,
                zipCode: business.location.zip_code,
                category: business.categories[0]?.title || "N/A", // Handle potential missing category
                rating: business.rating,
                reviewCount: business.review_count,
                longitude: business.coordinates.longitude,
                latitude: business.coordinates.latitude,
              };
            });
          } else {
            // Handle cases where 'businesses' key is missing in a successful response
            return [];
          }
        })
        // Add catch block for network errors or errors during processing
        .catch((error) => {
          console.error("Error fetching or processing Yelp data:", error);
          // Return empty array or re-throw error depending on desired app behavior
          return [];
        })
    );
  },
};

export default Yelp;
