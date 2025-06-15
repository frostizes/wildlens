import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

// Sample polygon (GeoJSON format)
function AnimalMap() {
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  const { animal } = useParams();
  const [results, setResults] = useState(null); // single animal, not an array
  const [categories, setCategories] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  const [animalPolygon, setAnimalPolygon] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/Catalog/GetAnimalLocation/${animal}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(response.data || null);
        setCategories(["Users", "Animals", "Category"]);
        const allPolygons = JSON.parse(response.data);
        // Parse polygon string into GeoJSON
        if (allPolygons != null) {
          setAnimalPolygon(allPolygons);
        } else {
          setAnimalPolygon(null);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setResults(null);
        setAnimalPolygon(null);
      }
    };

    fetchSearchResults();
  }, [animal]);

  return (
    <>
      <div className="container my-5">
        <div className="card-body p-0">
          <div className="map-responsive" style={{ width: "100%", overflowX: "auto" }}>
            <ComposableMap
              projectionConfig={{ scale: 160 }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup>
                {/* World countries */}
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "#f8f9fa",
                            stroke: "#dee2e6",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: "#0d6efd",
                            outline: "none",
                          },
                          pressed: {
                            fill: "#0b5ed7",
                            outline: "none",
                          },
                        }}
                        onClick={() => {
                          alert(`Clicked: ${geo.properties.NAME}`);
                        }}
                      />
                    ))
                  }
                </Geographies>

                <Geographies geography={animalPolygon}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => (
                      <Geography
                        key={`polygon-${i}`}
                        geography={geo}
                        style={{
                          default: {
                            fill: "rgba(0, 123, 255, 0.3)", // transparent Bootstrap blue
                            stroke: "#0d6efd",
                            strokeWidth: 1,
                            outline: "none",
                          },
                          hover: {
                            fill: "rgba(0, 123, 255, 0.5)",
                            outline: "none",
                          },
                          pressed: {
                            fill: "rgba(0, 123, 255, 0.7)",
                            outline: "none",
                          },
                        }}
                        onClick={() => alert(`Clicked polygon: ${geo.properties.name}`)}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnimalMap;
