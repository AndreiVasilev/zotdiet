import React, { useEffect, useState, useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import "./GroceryStores.css";

const defaultLocation = {
  address: "1600 Amphitheatre Parkway, Mountain View, california.",
  center: {
    lat: 37.3688,
    lng: -122.0363,
  },
  zoomLevel: 10,
};

const Map = () => (
  <div className="google-map" style={{ height: "300px", width: "1000px" }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
      defaultCenter={defaultLocation.center}
      defaultZoom={defaultLocation.zoomLevel}
    ></GoogleMapReact>
  </div>
);

const GroceryStores = () => {
  const baseURL =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const QUERY = "supermarket";
  const RADIUS = 50000;
  const KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

  const [positionCoords, setPositionCoords] = useState({});
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async ({ lat, lng }) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        crossdomain: true,
      };
      const endpoint = `https://cors-anywhere.herokuapp.com/${baseURL}?type=${QUERY}&location=${lat},${lng}&radius=${RADIUS}&key=${KEY}`;
      console.log(endpoint);
      const res = await axios.get(endpoint, {
        "Access-Control-Allow-Origin": "*",
        crossdomain: true,
      });

      const { results } = res.data;
      setStores(results.slice(0, 4));
    };
    if ("geolocation" in navigator) {
      console.log("Available");
    }
    if (navigator && navigator.geolocation) {
      console.log("Navigator Available");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPositionCoords({ lat: latitude, lng: longitude });

          fetchStores({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log("Error locating user location", error),
        {
          timeout: 5000,
        }
      );
    }
  }, []);

  return (
    <Card className="stores-container">
      <div className="stores-content">
        <div className="local-stores">
          <h1>Grocery Stores Near You</h1>
          <div>
            {stores &&
              stores.map((store) => (
                <div key={store.name}>
                  <strong>{store.name} - </strong>
                  <span>
                    <a
                      target="_blank"
                      href={`https://www.google.com/maps/place/${store.vicinity}`}
                    >
                      {store.vicinity}
                    </a>
                  </span>

                  <ul>
                    <li>
                      {store?.opening_hours?.open_now
                        ? "Currently Open"
                        : "Currently Closed"}
                    </li>
                    <li>Rating: {store.rating}/5 stars</li>
                  </ul>
                </div>
              ))}
          </div>
        </div>
        <div className="map">
          <Map />
        </div>
      </div>
    </Card>
  );
};

export default GroceryStores;
