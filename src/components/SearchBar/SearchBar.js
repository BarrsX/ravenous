import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      location: "",
      sortBy: "best_match",
      showFilters: false,
      cuisine: "",
      priceTiers: [],
      openNow: false,
      requireTakeout: false,
      requireDelivery: false,
      requireReservation: false,
      userCoordinates: null,
      isLocating: false,
      locationError: "",
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  sortByOptions = {
    "Best Match": "best_match",
    "Highest Rated": "rating",
    "Most Reviewed": "review_count",
    Distance: "distance",
  };

  cuisineOptions = [
    { label: "Any Cuisine", value: "" },
    { label: "American", value: "tradamerican" },
    { label: "Barbeque", value: "bbq" },
    { label: "Chinese", value: "chinese" },
    { label: "Indian", value: "indpak" },
    { label: "Italian", value: "italian" },
    { label: "Japanese", value: "japanese" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "Mexican", value: "mexican" },
    { label: "Thai", value: "thai" },
    { label: "Vietnamese", value: "vietnamese" },
  ];

  getSortByClass(sortByOption) {
    return this.state.sortBy === sortByOption ? "active" : "";
  }

  handleSortByChange(sortByOption) {
    this.setState(
      {
        sortBy: sortByOption,
      },
      () => {
        const hasLocation = this.state.location || this.state.userCoordinates;
        if (hasLocation) {
          this.handleSearch();
        }
      }
    );
  }

  handleTermChange(event) {
    this.setState({
      term: event.target.value,
    });
  }

  handleLocationChange(event) {
    this.setState({
      location: event.target.value,
      userCoordinates: null,
      locationError: "",
    });
  }

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleCuisineChange = (event) => {
    this.setState({ cuisine: event.target.value });
  };

  toggleFilters = () => {
    this.setState((previousState) => ({
      showFilters: !previousState.showFilters,
    }));
  };

  handlePriceToggle = (tier) => {
    this.setState((previousState) => {
      const hasTier = previousState.priceTiers.includes(tier);
      const nextPriceTiers = hasTier
        ? previousState.priceTiers.filter((value) => value !== tier)
        : [...previousState.priceTiers, tier];

      return {
        priceTiers: nextPriceTiers.sort((a, b) => a - b),
      };
    });
  };

  handleSearch(event) {
    if (event) {
      event.preventDefault();
    }

    const hasLocation = this.state.location || this.state.userCoordinates;
    if (!hasLocation) {
      return;
    }

    this.props.searchYelp({
      term: this.state.term || "restaurants",
      location: this.state.location,
      sortBy: this.state.sortBy,
      userCoordinates: this.state.userCoordinates,
      filters: {
        cuisine: this.state.cuisine,
        priceTiers: this.state.priceTiers,
        openNow: this.state.openNow,
        requireTakeout: this.state.requireTakeout,
        requireDelivery: this.state.requireDelivery,
        requireReservation: this.state.requireReservation,
      },
    });
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleSearch(event);
    }
  };

  getUserLocation = () => {
    if (!navigator.geolocation) {
      this.setState({
        locationError: "Location is not supported by this browser.",
      });
      return;
    }

    this.setState({ isLocating: true, locationError: "" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.setState({
          userCoordinates,
          location: "Current location",
          isLocating: false,
          locationError: "",
        });
      },
      (error) => {
        const errorMessages = {
          1: "Location permission was denied. Allow location access in your browser settings and try again.",
          2: "Your location is unavailable. Check your device's location settings and try again.",
          3: "Getting your location timed out. Please try again.",
        };

        this.setState({
          isLocating: false,
          locationError:
            errorMessages[error.code] ||
            "Unable to get your location. Please try again.",
        });
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 },
    );
  };

  renderSortByOptions() {
    return Object.keys(this.sortByOptions).map((sortByOption) => {
      const sortByOptionValue = this.sortByOptions[sortByOption];
      return (
        <li key={sortByOptionValue}>
          <button
            className={this.getSortByClass(sortByOptionValue)}
            onClick={this.handleSortByChange.bind(this, sortByOptionValue)}
            type="button"
            aria-label={`Sort by ${sortByOption}`}
            aria-pressed={this.state.sortBy === sortByOptionValue}
          >
            {sortByOption}
            {this.state.sortBy === sortByOptionValue && (
              <span className="active-indicator"> ✓</span>
            )}
          </button>
        </li>
      );
    });
  }

  renderPriceToggles() {
    return [1, 2, 3, 4].map((tier) => {
      const label = "$".repeat(tier);
      const active = this.state.priceTiers.includes(tier);

      return (
        <button
          key={tier}
          type="button"
          className={`price-toggle ${active ? "active" : ""}`}
          onClick={() => this.handlePriceToggle(tier)}
          aria-pressed={active}
        >
          {label}
        </button>
      );
    });
  }

  render() {
    const canSearch = this.state.location || this.state.userCoordinates;

    return (
      <div className="SearchBar">
        <div className="SearchBar-sort-options">
          <ul>{this.renderSortByOptions()}</ul>
        </div>
        <div className="SearchBar-fields">
          <input
            onChange={this.handleTermChange}
            onKeyPress={this.handleKeyPress}
            placeholder="What are you craving?"
            value={this.state.term}
            aria-label="Search for type of business"
          />
          <input
            onChange={this.handleLocationChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Where?"
            value={this.state.location}
            aria-label="Location"
          />
          <button
            onClick={this.getUserLocation}
            aria-label="Use my current location"
            type="button"
            disabled={this.state.isLocating}
          >
            {this.state.isLocating ? "Getting Location..." : "Use My Location"}
          </button>
        </div>
        {this.state.locationError && (
          <p className="SearchBar-location-status" role="alert">
            {this.state.locationError}
          </p>
        )}
        <div className="SearchBar-filter-toggle">
          <button
            type="button"
            onClick={this.toggleFilters}
            aria-expanded={this.state.showFilters}
            aria-controls="advanced-filters"
          >
            {this.state.showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {this.state.showFilters && (
          <>
            <div className="SearchBar-filters" id="advanced-filters">
              <select
                value={this.state.cuisine}
                onChange={this.handleCuisineChange}
                aria-label="Cuisine filter"
              >
                {this.cuisineOptions.map((option) => (
                  <option key={option.value || "any"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="price-toggles" aria-label="Price filters">
                {this.renderPriceToggles()}
              </div>
              <label>
                <input
                  type="checkbox"
                  name="openNow"
                  checked={this.state.openNow}
                  onChange={this.handleCheckboxChange}
                />
                Open Now
              </label>
              <label>
                <input
                  type="checkbox"
                  name="requireTakeout"
                  checked={this.state.requireTakeout}
                  onChange={this.handleCheckboxChange}
                />
                Takeout
              </label>
              <label>
                <input
                  type="checkbox"
                  name="requireDelivery"
                  checked={this.state.requireDelivery}
                  onChange={this.handleCheckboxChange}
                />
                Delivery
              </label>
              <label>
                <input
                  type="checkbox"
                  name="requireReservation"
                  checked={this.state.requireReservation}
                  onChange={this.handleCheckboxChange}
                />
                Reservations
              </label>
            </div>
          </>
        )}
        <div className="SearchBar-submit">
          <button
            type="button"
            className={`SearchBar-button ${!canSearch ? "disabled" : ""}`}
            onClick={this.handleSearch}
            disabled={!canSearch}
            aria-label="Search for businesses"
          >
            Let&apos;s Go
          </button>
        </div>
      </div>
    );
  }
}

export default SearchBar;
