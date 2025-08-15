import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Marker, Popup } from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// const markers = [
//   { id: 1, lat: 48.8566, lng: 2.3522, label: "Paris" },
//   { id: 2, lat: 51.5074, lng: -0.1278, label: "Londres" },
//   { id: 3, lat: 40.7128, lng: -74.006, label: "New York" },
//   { id: 4, lat: 35.6895, lng: 139.6917, label: "Tokyo" },
// ];

function AnimalMap() {
  const { animal } = useParams();
  const [results, setResults] = useState(null);
  const [animalPolygon, setAnimalPolygon] = useState(null);
  const [showMine, setShowMine] = useState(false);
  const [selectedEndangerLevels, setSelectedEndangerLevels] = useState(["common", "uncommon", "rare", "extinct"]);
  const [markers, setMarkers] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const endangerLevels = [
    "Least Concern",
    "Near Threatened",
    "Vulnerable",
    "Endangered",
    "Critically Endangered",
    "Extinct in the Wild",
    "Extinct"
  ];

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Prepare the request object
        const requestParams = {
          NorthEastBoundCorner: 10, // You might also need lng
          SouthWestBoundCorner: 10, // Same here
          Zoom: 1,
          RedlistCategory: "redlistCategory",
          ShowOnlyUserPictures: false
        };

        const response = await axios.get(`${API_BASE_URL}/Search/AllPicturePoints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: requestParams
        });
        // setMarkers(response.data);
        const data = response.data; // array of AnimalPictureLocationDto
        console.log("datra", data[0]);
        setMarkers(data.map(item => ({
          id: item.pictureId,
          lat: item.latitude,
          lng: item.longitude,
          label: "ben"
        })));


      } catch (err) {
        console.error("Search failed:", err);
        setResults(null);
        setAnimalPolygon(null);
      }
    };

    fetchSearchResults();
  }, [animal]);

  const handleEndangerChange = (level) => {
    setSelectedEndangerLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div style={{ display: 'flex', height: '80vh', width: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '250px', padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
        <h5>Filters</h5>
        <Form.Check
          type="switch"
          id="show-mine-switch"
          label="Show only my pictures"
          checked={showMine}
          onChange={(e) => setShowMine(e.target.checked)}
        />

        <div className="mt-3">
          <strong>Endangerment Levels</strong>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {endangerLevels.map(level => (
              <Form.Check
                key={level}
                type="checkbox"
                label={level}
                checked={selectedEndangerLevels.includes(level)}
                onChange={() => handleEndangerChange(level)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flexGrow: 1 }}>
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={3}
          worldCopyJump={false}
          maxBoundsViscosity={1.0}
          maxBounds={[[-85, -180], [85, 180]]}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            chunkedLoading={true} // improves performance for many markers
            showCoverageOnHover={false} // hide circle around clusters
            spiderfyOnMaxZoom={true}>
            {markers.map(marker => (
              <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                <Popup>{marker.label}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          <MapEventLogger onMove={(center, zoom) => {
            // optional: call fetchMarkers(center, zoom) here
          }} />
        </MapContainer>
      </div>
    </div>
  );
}

function MapEventLogger({ onMove }) {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const map = useMapEvents({
    moveend: () => {
      console.log("ben", map.getCenter(), map.getZoom());
      console.log("bound", map.getBounds());
      if (onMove) onMove(map.getCenter(), map.getZoom());
    },
    zoomend: () => {
      console.log("ben", map.getCenter(), map.getZoom());
      if (onMove) onMove(map.getCenter(), map.getZoom());
    },
  });

  return null;
}

export default AnimalMap;
