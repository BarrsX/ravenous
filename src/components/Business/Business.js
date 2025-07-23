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
    const rating = this.props.business.rating;
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
    return (
      <div className="Business">
        <div className="image-container">
          <img
            src={this.props.business.imageSrc}
            alt={this.props.business.name}
          />
        </div>
        <h2>{this.props.business.name}</h2>
        {this.props.business.distance && (
          <div className="Business-distance">
            <span role="img" aria-label="location">
              📍
            </span>
            {(this.props.business.distance * 0.000621371).toFixed(1)} miles away
          </div>
        )}
        {this.props.business.isOpenNow !== null && (
          <div
            className={`Business-status ${
              this.props.business.isOpenNow ? "open" : "closed"
            }`}
          >
            {this.props.business.isOpenNow ? "🟢 Open Now" : "🔴 Closed"}
          </div>
        )}
        <div className="Business-information">
          <div className="Business-reviews">
            <div className="Business-categories">
              {this.props.business.categories &&
              this.props.business.categories.length > 0 ? (
                this.props.business.categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))
              ) : (
                <h3>{this.props.business.category}</h3>
              )}
            </div>
            {this.props.business.price !== "N/A" && (
              <div className="Business-price">
                <span className="price-label">Price: </span>
                <span className="price-value">{this.props.business.price}</span>
              </div>
            )}
            <div className="Business-rating">
              <div className="stars-container">{this.renderStars()}</div>
              <span className="rating-text">{this.props.business.rating}</span>
            </div>
            <p>{this.props.business.reviewCount} reviews</p>
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
              <p>{this.props.business.address}</p>
              <p>{this.props.business.city}</p>
              <p>
                {this.props.business.state}, {this.props.business.zipCode}
              </p>
            </Link>
          </div>

          {this.props.business.url && (
            <div className="Business-actions">
              <a
                href={this.props.business.url}
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
