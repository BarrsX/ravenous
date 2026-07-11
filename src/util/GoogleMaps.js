const NOMINATIM_API_BASE = "https://nominatim.openstreetmap.org";

const fetchJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return data;
};

const formatHours = (timeValue) => {
  if (!timeValue || timeValue.length !== 4) {
    return null;
  }

  const hours = Number.parseInt(timeValue.slice(0, 2), 10);
  const minutes = timeValue.slice(2);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes} ${suffix}`;
};

const GoogleMaps = {
  async geocodeLocation(location) {
    if (!location) {
      return null;
    }

    const encodedLocation = encodeURIComponent(location);
    const url = `${NOMINATIM_API_BASE}/search?format=jsonv2&limit=1&q=${encodedLocation}`;
    const data = await fetchJson(url);

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    const result = data[0];
    const latitude = Number.parseFloat(result.lat);
    const longitude = Number.parseFloat(result.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
      formattedAddress: result.display_name || location,
    };
  },

  async reverseGeocode(latitude, longitude) {
    const url =
      `${NOMINATIM_API_BASE}/reverse?format=jsonv2&addressdetails=1` +
      `&lat=${latitude}&lon=${longitude}`;
    const data = await fetchJson(url);

    if (!data || !data.address) {
      return null;
    }

    const address = data.address;
    const label =
      address.postcode ||
      address.city ||
      address.town ||
      address.village ||
      data.display_name ||
      "";

    return {
      label,
      formattedAddress: data.display_name || label,
    };
  },

  async getTravelTimes(origin, destinations) {
    if (!origin || !destinations || destinations.length === 0) {
      return {};
    }

    const uniqueDestinations = destinations.filter(
      (destination) =>
        destination &&
        typeof destination.latitude === "number" &&
        typeof destination.longitude === "number" &&
        destination.id,
    );

    if (!uniqueDestinations.length) {
      return {};
    }

    // Distance Matrix is not available in the free Nominatim endpoint.
    return {};
  },

  loadMapsScript() {
    return Promise.reject(
      new Error(
        "Google Maps script loading has been removed. Use an OpenStreetMap-based map component instead.",
      ),
    );
  },

  formatHoursRange(start, end) {
    const formattedStart = formatHours(start);
    const formattedEnd = formatHours(end);

    if (!formattedStart || !formattedEnd) {
      return null;
    }

    return `${formattedStart} - ${formattedEnd}`;
  },
};

export default GoogleMaps;
