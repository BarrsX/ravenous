const GOOGLE_MAPS_API_BASE = "https://maps.googleapis.com/maps/api";

const ensureApiKey = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing REACT_APP_GOOGLE_MAPS_API_KEY");
  }
  return apiKey;
};

const fetchGoogleJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.status === "REQUEST_DENIED") {
    throw new Error(data.error_message || `Google API request failed: ${response.status}`);
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

    const apiKey = ensureApiKey();
    const encodedLocation = encodeURIComponent(location);
    const url = `${GOOGLE_MAPS_API_BASE}/geocode/json?address=${encodedLocation}&key=${apiKey}`;
    const data = await fetchGoogleJson(url);

    if (!data.results || !data.results.length) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  },

  async reverseGeocode(latitude, longitude) {
    const apiKey = ensureApiKey();
    const url = `${GOOGLE_MAPS_API_BASE}/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const data = await fetchGoogleJson(url);

    if (!data.results || !data.results.length) {
      return null;
    }

    const firstResult = data.results[0];
    const zipCode = firstResult.address_components.find((component) =>
      component.types.includes("postal_code")
    );

    return {
      label: zipCode ? zipCode.long_name : firstResult.formatted_address,
      formattedAddress: firstResult.formatted_address,
    };
  },

  async getTravelTimes(origin, destinations) {
    if (!origin || !destinations || destinations.length === 0) {
      return {};
    }

    const apiKey = ensureApiKey();
    const uniqueDestinations = destinations.filter(
      (destination) =>
        destination &&
        typeof destination.latitude === "number" &&
        typeof destination.longitude === "number" &&
        destination.id
    );

    if (!uniqueDestinations.length) {
      return {};
    }

    const batched = [];
    const chunkSize = 25;

    for (let index = 0; index < uniqueDestinations.length; index += chunkSize) {
      batched.push(uniqueDestinations.slice(index, index + chunkSize));
    }

    const travelTimes = {};

    for (const destinationBatch of batched) {
      const destinationString = destinationBatch
        .map((destination) => `${destination.latitude},${destination.longitude}`)
        .join("|");

      const url =
        `${GOOGLE_MAPS_API_BASE}/distancematrix/json` +
        `?origins=${origin.latitude},${origin.longitude}` +
        `&destinations=${destinationString}` +
        `&mode=driving&units=imperial&key=${apiKey}`;

      const data = await fetchGoogleJson(url);
      const rows = data.rows || [];

      if (!rows.length || !rows[0].elements) {
        continue;
      }

      rows[0].elements.forEach((element, rowIndex) => {
        const destination = destinationBatch[rowIndex];
        if (!destination || element.status !== "OK") {
          return;
        }

        travelTimes[destination.id] = {
          durationText: element.duration?.text || null,
          durationSeconds: element.duration?.value || null,
          distanceText: element.distance?.text || null,
        };
      });
    }

    return travelTimes;
  },

  loadMapsScript() {
    if (window.google && window.google.maps) {
      return Promise.resolve(window.google.maps);
    }

    if (window.__googleMapsScriptPromise) {
      return window.__googleMapsScriptPromise;
    }

    const apiKey = ensureApiKey();
    window.__googleMapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });

    return window.__googleMapsScriptPromise;
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
