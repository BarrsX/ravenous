import React from "react";
import GoogleMaps from "../../util/GoogleMaps";
import "./MapView.css";

class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };

    this.mapContainerRef = React.createRef();
    this.map = null;
    this.markers = [];
    this.infoWindow = null;
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.businesses !== this.props.businesses ||
      prevProps.mapCenter !== this.props.mapCenter
    ) {
      this.updateMarkers();
    }

    if (prevProps.businesses !== this.props.businesses && this.props.businesses.length > 0) {
      this.setState({ isExpanded: false });
    }

    if (prevProps.mapCenter !== this.props.mapCenter) {
      this.refreshMapSize();
    }
  }

  componentWillUnmount() {
    this.clearMarkers();
  }

  async initializeMap() {
    try {
      await GoogleMaps.loadMapsScript();

      const defaultCenter = this.getDefaultCenter();
      this.map = new window.google.maps.Map(this.mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      this.infoWindow = new window.google.maps.InfoWindow();
      this.updateMarkers();
    } catch (error) {
      console.error("Unable to initialize Google map", error);
    }
  }

  getDefaultCenter() {
    if (this.props.mapCenter) {
      return {
        lat: this.props.mapCenter.latitude,
        lng: this.props.mapCenter.longitude,
      };
    }

    const firstBusiness = this.props.businesses.find(
      (business) =>
        typeof business.latitude === "number" &&
        typeof business.longitude === "number"
    );

    if (firstBusiness) {
      return {
        lat: firstBusiness.latitude,
        lng: firstBusiness.longitude,
      };
    }

    return { lat: 39.8283, lng: -98.5795 };
  }

  toRadians(value) {
    return (value * Math.PI) / 180;
  }

  calculateDistanceMiles(from, to) {
    const earthRadiusMiles = 3958.8;
    const latDelta = this.toRadians(to.latitude - from.latitude);
    const lngDelta = this.toRadians(to.longitude - from.longitude);
    const lat1 = this.toRadians(from.latitude);
    const lat2 = this.toRadians(to.latitude);

    const a =
      Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMiles * c;
  }

  getBusinessesWithCoordinates() {
    return this.props.businesses.filter(
      (business) =>
        typeof business.latitude === "number" &&
        typeof business.longitude === "number"
    );
  }

  getBusinessesForBounds() {
    const businesses = this.getBusinessesWithCoordinates();

    if (!this.props.mapCenter) {
      return businesses.slice(0, 20);
    }

    return [...businesses]
      .map((business) => ({
        ...business,
        distanceFromCenter: this.calculateDistanceMiles(this.props.mapCenter, {
          latitude: business.latitude,
          longitude: business.longitude,
        }),
      }))
      .sort((left, right) => left.distanceFromCenter - right.distanceFromCenter)
      .slice(0, 20);
  }

  refreshMapSize() {
    if (!this.map || !window.google || !window.google.maps) {
      return;
    }

    setTimeout(() => {
      window.google.maps.event.trigger(this.map, "resize");
      this.updateMarkers();
    }, 220);
  }

  toggleMapSize = () => {
    this.setState(
      (previousState) => ({
        isExpanded: !previousState.isExpanded,
      }),
      () => {
        this.refreshMapSize();
      }
    );
  };

  recenterMap = () => {
    if (!this.map || !this.props.mapCenter) {
      return;
    }

    this.map.panTo({
      lat: this.props.mapCenter.latitude,
      lng: this.props.mapCenter.longitude,
    });

    if (this.map.getZoom() < 13) {
      this.map.setZoom(13);
    }
  };

  applySmartBounds(bounds, markerCount) {
    this.map.fitBounds(bounds, 70);

    window.google.maps.event.addListenerOnce(this.map, "idle", () => {
      const currentZoom = this.map.getZoom();

      if (markerCount <= 1 && currentZoom > 15) {
        this.map.setZoom(15);
        return;
      }

      if (markerCount > 1) {
        if (currentZoom > 15) {
          this.map.setZoom(15);
        }

        if (currentZoom < 11) {
          this.map.setZoom(11);
        }
      }
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  updateMarkers() {
    if (!this.map || !window.google || !window.google.maps) {
      return;
    }

    this.clearMarkers();
    const bounds = new window.google.maps.LatLngBounds();
    let markerCount = 0;

    if (this.props.mapCenter) {
      const centerPosition = {
        lat: this.props.mapCenter.latitude,
        lng: this.props.mapCenter.longitude,
      };
      const userHalo = new window.google.maps.Marker({
        map: this.map,
        position: centerPosition,
        title: "You are here",
        zIndex: 3,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: "#2d7ff9",
          fillOpacity: 0.2,
          strokeColor: "#2d7ff9",
          strokeOpacity: 0.35,
          strokeWeight: 1,
        },
      });

      const userMarker = new window.google.maps.Marker({
        map: this.map,
        position: centerPosition,
        title: "You are here",
        zIndex: 4,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#2d7ff9",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      this.markers.push(userHalo);
      this.markers.push(userMarker);
      bounds.extend(userMarker.getPosition());
      markerCount += 1;
    }

    this.getBusinessesWithCoordinates().forEach((business) => {
      const marker = new window.google.maps.Marker({
        map: this.map,
        position: {
          lat: business.latitude,
          lng: business.longitude,
        },
        title: business.name,
      });

      marker.addListener("click", () => {
        this.infoWindow.setContent(
          `<div class="MapView-infoWindow">
            <strong>${business.name}</strong>
            <div>${business.address}</div>
            <div>${business.city}, ${business.state}</div>
            <div>Rating: ${business.rating} (${business.reviewCount} reviews)</div>
          </div>`
        );
        this.infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });

    this.getBusinessesForBounds().forEach((business) => {
      bounds.extend({
        lat: business.latitude,
        lng: business.longitude,
      });
      markerCount += 1;
    });

    if (markerCount > 0) {
      this.applySmartBounds(bounds, markerCount);
    } else {
      this.map.setCenter(this.getDefaultCenter());
      this.map.setZoom(4);
    }
  }

  render() {
    const toggleLabel = this.state.isExpanded ? "Compact Map" : "Expand Map";

    return (
      <section className="MapView" aria-label="Map search results">
        <div className="MapView-header">
          <h2>Map Results</h2>
          <div className="MapView-controls">
            <button type="button" onClick={this.toggleMapSize}>
              {toggleLabel}
            </button>
          </div>
        </div>
        <div className={`MapView-canvas ${this.state.isExpanded ? "expanded" : ""}`} ref={this.mapContainerRef} />
        {this.props.mapCenter && (
          <button type="button" className="MapView-recenter" onClick={this.recenterMap}>
            Recenter on me
          </button>
        )}
      </section>
    );
  }
}

export default MapView;
