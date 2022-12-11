const apiKey = 'sP5eSul4f480F-oNSWCkmvnp2IlDFR-r2j9JJQHGRYFBI9S8im_raIsnlli7eBNxD8PMYoVwue8MQWW48Wlxde5U73ZXceiuKlfaXhjt2sMo7WcC_e-0EX7g-jdVYHYx'

const Yelp = {
  search(term, location, sortBy) {
    return fetch(
      `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.businesses) {
          return jsonResponse.businesses.map(business => {
            return {
              id: business.id,
              imageSrc: business.image_url,
              name: business.name,
              address: business.location.address1,
              city: business.location.city,
              state: business.location.state,
              zipCode: business.location.zip_code,
              category: business.categories[0].title,
              rating: business.rating,
              reviewCount: business.review_count,
              longitude: business.coordinates.longitude,
              latitude: business.coordinates.latitude
            };
          });
        }
      });
  }
};


export default Yelp;
