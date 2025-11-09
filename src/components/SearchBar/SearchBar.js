import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      location: "",
      sortBy: "best_match",
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

  getSortByClass(sortByOption) {
    if (this.state.sortBy === sortByOption) {
      return "active";
    }
    return "";
  }

  // Handle State Changes
  handleSortByChange(sortByOption) {
    this.setState(
      {
        sortBy: sortByOption,
      },
      () => {
        this.handleSearch();
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
    });
  }

  handleSearch(event) {
    if (event) event.preventDefault();
    if (this.state.term && this.state.location) {
      this.props.searchYelp(
        this.state.term,
        this.state.location,
        this.state.sortBy
      );
    }
  }

  getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  reverseGeocode = (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const zipCode = data.results[0].address_components.find((component) =>
            component.types.includes("postal_code")
          );
          if (zipCode) {
            this.setState({ location: zipCode.long_name });
          }
        }
      })
      .catch((error) => console.error("Error reverse geocoding:", error));
  };

  renderSortByOptions() {
    return Object.keys(this.sortByOptions).map((sortByOption) => {
      let sortByOptionValue = this.sortByOptions[sortByOption];
      return (
        <li key={sortByOptionValue}>
          <button
            className={this.getSortByClass(sortByOptionValue)}
            onClick={this.handleSortByChange.bind(this, sortByOptionValue)}
            type="button"
          >
            {sortByOption}
          </button>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="SearchBar">
        <div className="SearchBar-sort-options">
          <ul>{this.renderSortByOptions()}</ul>
        </div>
        <div className="SearchBar-fields">
          <input
            onChange={this.handleTermChange}
            placeholder="Search Businesses"
          />
          <input
            onChange={this.handleLocationChange}
            placeholder="Where?"
            value={this.state.location}
          />
          <button onClick={this.getUserLocation}>Use My Location</button>
        </div>
        <div className="SearchBar-submit">
          <button
            type="button"
            className="SearchBar-button"
            onClick={this.handleSearch}
          >
            Let's Go
          </button>
        </div>
      </div>
    );
  }
}

export default SearchBar;
