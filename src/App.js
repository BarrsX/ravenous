import React from "react";
import BusinessList from "./components/BusinessList/BusinessList";
import SearchBar from "./components/SearchBar/SearchBar";
import GoogleMaps from "./util/GoogleMaps";
import Yelp from "./util/Yelp";
import "./App.css";
import "./LoadingBar.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businesses: [],
      searchPerformed: false,
      isLoading: false,
    };

    this.searchYelp = this.searchYelp.bind(this);
  }

  applyPostFilters(businesses, filters) {
    return businesses.filter((business) => {
      if (filters.requireTakeout && !business.supportsTakeout) {
        return false;
      }

      if (filters.requireDelivery && !business.supportsDelivery) {
        return false;
      }

      if (filters.requireReservation && !business.supportsReservation) {
        return false;
      }

      return true;
    });
  }

  async searchYelp(searchRequest) {
    this.setState({ isLoading: true });

    const {
      location,
      sortBy,
      userCoordinates,
      filters,
      term,
    } = searchRequest;

    let resolvedCoordinates = userCoordinates || null;

    if (!resolvedCoordinates && location) {
      try {
        const geocodedLocation = await GoogleMaps.geocodeLocation(location);
        if (geocodedLocation) {
          resolvedCoordinates = {
            latitude: geocodedLocation.latitude,
            longitude: geocodedLocation.longitude,
          };
        }
      } catch (error) {
        resolvedCoordinates = null;
      }
    }

    let businesses = await Yelp.search({
      term,
      location,
      coordinates: resolvedCoordinates,
      sortBy,
      cuisine: filters.cuisine,
      priceTiers: filters.priceTiers,
      openNow: filters.openNow,
    });

    businesses = this.applyPostFilters(businesses, filters);

    this.setState({
      businesses,
      searchPerformed: true,
      isLoading: false,
    });
  }

  render() {
    return (
      <div className="App">
        <h1>ravenous</h1>
        <SearchBar searchYelp={this.searchYelp} />
        <BusinessList
          businesses={this.state.businesses}
          searchPerformed={this.state.searchPerformed}
          isLoading={this.state.isLoading}
        />
      </div>
    );
  }
}

export default App;
