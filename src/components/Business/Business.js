import { Link } from "@mui/material";
import React from "react";
// import axios from 'axios';
import "./Business.css";

class Business extends React.Component {
  constructor() {
    super();

    this.state = {
      link: "",
    };
  }

  componentDidMount() {
    this.updateMapLink();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.business.id !== this.props.business.id) {
      this.updateMapLink();
    }
  }

  updateMapLink() {
    const { address, city, state, zipCode, name } = this.props.business;
    const mapsUrl = this.constructGoogleMapsSearchUrl(
      address,
      city,
      state,
      zipCode,
      name
    );
    this.setState({ link: mapsUrl });
  }

  constructGoogleMapsSearchUrl(address, city, state, zipCode, name) {
    const formattedAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const encodedQuery = encodeURIComponent(`${name} ${formattedAddress}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    return url;
  }

  renderStars() {
    const rating = this.props.business.rating || 0;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star full">
          ★
        </span>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    // Add empty stars to complete 5 stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  }

  render() {
    const { business } = this.props;

    return (
      <div className="Business">
        <div className="image-container">
          {business.imageSrc ? (
            <img src={business.imageSrc} alt={business.name} />
          ) : (
            <div className="image-fallback">No photo available</div>
          )}
        </div>
        <h2>{business.name}</h2>
        {business.distance && (
          <div className="Business-distance">
            <span role="img" aria-label="location">
              📍
            </span>
            {(business.distance * 0.000621371).toFixed(1)} miles away
          </div>
        )}
        {business.isOpenNow !== null && (
          <div
            className={`Business-status ${
              business.isOpenNow ? "open" : "closed"
            }`}
          >
            {business.isOpenNow ? "🟢 Open Now" : "🔴 Closed"}
          </div>
        )}
        {business.hoursDisplay && (
          <div className="Business-hours">{business.hoursDisplay}</div>
        )}
        <div className="Business-information">
          <div className="Business-reviews">
            <div className="Business-categories">
              {business.categories && business.categories.length > 0 ? (
                business.categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))
              ) : (
                <h3>{business.category}</h3>
              )}
            </div>
            {business.price !== "N/A" && (
              <div className="Business-price">
                <span className="price-label">Price: </span>
                <span className="price-value">{business.price}</span>
              </div>
            )}
            <div className="Business-rating">
              <div className="stars-container">{this.renderStars()}</div>
              <span className="rating-text">{business.rating}</span>
            </div>
            <p>{business.reviewCount} reviews</p>
            <div className="Business-flags">
              <span className={business.supportsTakeout ? "enabled" : "disabled"}>
                Takeout
              </span>
              <span className={business.supportsDelivery ? "enabled" : "disabled"}>
                Delivery
              </span>
              <span className={business.supportsReservation ? "enabled" : "disabled"}>
                Reservations
              </span>
            </div>
          </div>

          <div className="Business-address">
            <Link
              underline="none"
              href={this.state.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="address-header">
                <span role="img" aria-label="map pin">
                  📍
                </span>
                <span className="address-label">Address</span>
              </div>
              <p>{business.address}</p>
              <p>{business.city}</p>
              <p>
                {business.state}, {business.zipCode}
              </p>
            </Link>
          </div>

          {business.url && (
            <div className="Business-actions">
              <a
                href={business.url}
                target="_blank"
                rel="noopener noreferrer"
                className="Business-yelp-link"
              >
                View on Yelp →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Business;
