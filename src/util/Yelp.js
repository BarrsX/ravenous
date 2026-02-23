import GoogleMaps from "./GoogleMaps";

const YELP_API_BASE = "https://api.yelp.com/v3";
const CORS_PROXY = "https://morning-stream-08762.herokuapp.com/";
const DETAILS_LIMIT = 16;

const buildProxyUrl = (pathWithQuery) => `${CORS_PROXY}${YELP_API_BASE}${pathWithQuery}`;

const requestYelp = async (pathWithQuery = "", method = "GET") => {
  const response = await fetch(buildProxyUrl(pathWithQuery), {
    method,
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Yelp API request failed: ${response.status}`);
  }

  return response.json();
};

const formatSchedule = (hours) => {
  if (!hours || !hours.length || !hours[0].open || !hours[0].open.length) {
    return null;
  }

  const jsDay = new Date().getDay();
  const yelpDay = (jsDay + 6) % 7;
  const todaysPeriods = hours[0].open.filter((period) => period.day === yelpDay);

  if (!todaysPeriods.length) {
    return null;
  }

  const formattedPeriods = todaysPeriods
    .map((period) => GoogleMaps.formatHoursRange(period.start, period.end))
    .filter(Boolean);

  if (!formattedPeriods.length) {
    return null;
  }

  return `Today: ${formattedPeriods.join(", ")}`;
};

const mapBusiness = (business) => {
  const transactions = business.transactions || [];

  return {
    id: business.id,
    imageSrc: business.image_url || "",
    name: business.name,
    address: business.location?.address1 || "N/A",
    city: business.location?.city || "",
    state: business.location?.state || "",
    zipCode: business.location?.zip_code || "",
    category: business.categories?.[0]?.title || "N/A",
    categories: business.categories?.slice(0, 3).map((category) => category.title) || [],
    rating: business.rating,
    reviewCount: business.review_count,
    longitude: business.coordinates?.longitude,
    latitude: business.coordinates?.latitude,
    price: business.price || "N/A",
    phone: business.display_phone || business.phone || "",
    url: business.url || "",
    distance: business.distance ? Math.round(business.distance) : null,
    isOpenNow: business.hours?.[0]?.is_open_now ?? (business.is_closed === false ? null : false),
    hoursDisplay: formatSchedule(business.hours),
    supportsDelivery: transactions.includes("delivery"),
    supportsTakeout: transactions.includes("pickup"),
    supportsReservation: transactions.includes("restaurant_reservation"),
    transactions,
  };
};

const enrichBusinessWithDetails = async (business) => {
  try {
    const details = await requestYelp(`/businesses/${business.id}`);
    const transactions = details.transactions || business.transactions || [];
    const attributes = details.attributes || {};

    return {
      ...business,
      isOpenNow: details.hours?.[0]?.is_open_now ?? business.isOpenNow,
      hoursDisplay: formatSchedule(details.hours) || business.hoursDisplay,
      supportsDelivery: business.supportsDelivery || transactions.includes("delivery"),
      supportsTakeout: business.supportsTakeout || transactions.includes("pickup"),
      supportsReservation:
        business.supportsReservation ||
        transactions.includes("restaurant_reservation") ||
        attributes.restaurant_reservation === true,
      transactions,
    };
  } catch (error) {
    return business;
  }
};

const Yelp = {
  async search(searchParams) {
    const {
      term,
      location,
      coordinates,
      sortBy,
      cuisine,
      priceTiers,
      openNow,
      radiusMeters,
    } = searchParams;

    try {
      const query = new URLSearchParams();
      query.set("term", term || "restaurants");
      query.set("limit", "48");
      query.set("sort_by", sortBy || "best_match");

      if (coordinates && coordinates.latitude && coordinates.longitude) {
        query.set("latitude", coordinates.latitude);
        query.set("longitude", coordinates.longitude);
      } else {
        query.set("location", location);
      }

      if (cuisine) {
        query.set("categories", cuisine);
      }

      if (Array.isArray(priceTiers) && priceTiers.length) {
        query.set("price", priceTiers.join(","));
      }

      if (openNow) {
        query.set("open_now", "true");
      }

      if (radiusMeters) {
        query.set("radius", `${radiusMeters}`);
      }

      const jsonResponse = await requestYelp(`/businesses/search?${query.toString()}`);

      if (!jsonResponse.businesses) {
        return [];
      }

      const mappedBusinesses = jsonResponse.businesses.map(mapBusiness);
      const detailPromises = mappedBusinesses
        .slice(0, DETAILS_LIMIT)
        .map((business) => enrichBusinessWithDetails(business));
      const enrichedBusinesses = await Promise.all(detailPromises);

      return [
        ...enrichedBusinesses,
        ...mappedBusinesses.slice(DETAILS_LIMIT),
      ];
    } catch (error) {
      console.error("Error fetching or processing Yelp data:", error);
      return [];
    }
  },
};

export default Yelp;
