import { Link } from '@mui/material';
import React from 'react';
// import axios from 'axios';
import './Business.css';


class Business extends React.Component {
    constructor() {
        super();

        this.state = {
            link: ''
        };
    }

    componentDidMount() {
        this.getPlaceID(this.props.business.latitude, this.props.business.longitude, this.props.business.name)
            .then(x => this.setState({
                link: x
            }));
    }

    getPlaceID(lat, long, name) {
        let apiKey = 'AIzaSyAFjagYUP76eJQmoDDGze9TtHboIBpY_0s';
        var bizName = name.replace(' ', '%20');

        var searchString = `https://morning-stream-08762.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${bizName}&inputtype=textquery&locationbias=circle%3A2000%40${lat}%2C${long}&fields=place_id&key=${apiKey}`;

        return fetch(searchString)
            .then(response => response.json())
            .then(json => {
                if (json.status === 'OK') {
                    return json.candidates[0].place_id;
                }
            })
            .then(placeId => {
                if (placeId) {
                    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
                } else {
                    return `https://maps.google.com?q=${this.props.business.latitude},${this.props.business.longitude}`
                }
            });
    };
    
    render() {
        return (
            <div className="Business">
                <div className="image-container">
                    <img src={this.props.business.imageSrc} alt={this.props.business.name} />
                </div>
                <h2>{this.props.business.name}</h2>
                <div className="Business-information">
                    <div className="Business-address">
                        <Link underline='none' href={this.state.link} target='_blank' rel='noopener noreferrer'>
                            <p>{this.props.business.address}</p>
                            <p>{this.props.business.city}</p>
                            <p>{this.props.business.state}, {this.props.business.zipCode}</p>
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
