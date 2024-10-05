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
    this.getPlaceID(address, city, state, zipCode, name).then((link) =>
      this.setState({ link })
    );
  }

  getPlaceID(address, city, state, zipCode, name) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const formattedAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const encodedQuery = encodeURIComponent(`${name} ${formattedAddress}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    return Promise.resolve(url);
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
        <div className="Business-information">
          <div className="Business-address">
            <Link
              underline="none"
              href={this.state.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>{this.props.business.address}</p>
              <p>{this.props.business.city}</p>
              <p>
                {this.props.business.state}, {this.props.business.zipCode}
              </p>
            </Link>
          </div>
          <div className="Business-reviews">
            <h3>{this.props.business.category}</h3>
            <h3 className="rating">{this.props.business.rating} stars</h3>
            <p>{this.props.business.reviewCount} reviews</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Business;
