import React, { useEffect, useState, useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import { Edit } from "react-feather";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { db, auth } from "../utils/firebase";
import spoonService from "../services/SpoonService";
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
  <div className="google-map" style={{ height: "300px", width: "500px" }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
      defaultCenter={defaultLocation.center}
      defaultZoom={defaultLocation.zoomLevel}
    ></GoogleMapReact>
  </div>
);

const Checkbox = ({ label }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        value={label}
        onChange={handleChange}
        defaultChecked={checked}
      />
      <span>{label}</span>
    </div>
  );
};

const GroceryStores = () => {
  const baseURL =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const QUERY = "supermarket";
  const RADIUS = 50000;
  const KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

  const [positionCoords, setPositionCoords] = useState({});
  const [stores, setStores] = useState([]);
  const [meals, setMeals] = useState();
  const [ingredients, setIngredients] = useState(["Beans", "Bread"]);
  const [groceryListItems, setGroceryListItems] = useState([]);

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
        (error) => console.log("Error locating user location", error)
      );
    }
  }, []);

  useEffect(() => {
    const getAllIngredients = async (fetchedMeals) => {
      console.log("fetchedMeals", fetchedMeals);
      let formattedBulk = fetchedMeals?.map((meal) => meal?.id ?? "");
      formattedBulk = formattedBulk.join(",");

      console.log("formattedBulk", formattedBulk);

      if (formattedBulk) {
        let ings = [];

        ings = await spoonService.getBulkMealIngredients(formattedBulk);

        console.log("ings", ings);

        let extendedIngs = [];
        ings.forEach((ing) => {
          for (let el in ing.extendedIngredients) {
            extendedIngs.push(ing.extendedIngredients[el].name);
          }
        });

        console.log(extendedIngs);

        const rmDupsIngs = extendedIngs.reduce(function (prev, curr) {
          if (prev.indexOf(curr) < 0) prev.push(curr);
          return prev;
        }, []);

        if (ings.result !== "failed") {
          setGroceryListItems(rmDupsIngs);
        }
      }
    };

    const mealsRef = db.ref("/users/" + "118022199851261398091" + "/mealPlan");

    mealsRef.on("value", (snapshot) => {
      const { week } = snapshot.val();
      console.log(week);

      let localMeals = [];
      for (const [key, value] of Object.entries(week)) {
        const { meals: fetchedMeals } = value;

        localMeals.push(...fetchedMeals);
      }

      setMeals(localMeals);
      getAllIngredients(localMeals);
    });
  }, []);

  return (
    <Card className="stores-container">
      <div className="flex-row">
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
        <div className="grocery-list">
          <h1>
            Grocery List
            <span className="pencil-icon">
              <Edit />
            </span>
          </h1>
          <div className="grocery-list-wrapper">
            {groceryListItems.map((item) => (
              <Checkbox label={item} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroceryStores;
