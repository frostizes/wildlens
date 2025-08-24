import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';

function Taxonomy() {
  const location = useLocation();
  const [allScores, setAllScores] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [path, setPath] = useState(["Mammal"]);
  const [loading, setLoading] = useState(true);
  const [userName, SetUserName] = useState("");
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  useEffect(() => {
    async function fetchTaxonomy() {
      SetUserName(localStorage.getItem("userName"));
      try {
        const token = localStorage.getItem("authToken");
        console.log("token", token);
        const response = await axios.get(`${API_BASE_URL}/Catalog/GetUserCatalog`, {
          withCredentials: true
        });

        const catalog = response.data;
        // Flatten taxonomy scores into one array
        const allData = [
          ...(catalog.scorePerAnimalClassificationCategories?.orderName || []).map(u => ({
            name: u.category.name,
            parent: u.category.parent,
            score: u.score,
            totalScore: u.category.totalScore,
            level: "Order"
          })),
          ...(catalog.scorePerAnimalClassificationCategories?.familyName || []).map(u => ({
            name: u.category.name,
            parent: u.category.parent,
            score: u.score,
            totalScore: u.category.totalScore,
            level: "Family"
          })),
          ...(catalog.scorePerAnimalClassificationCategories?.genusName || []).map(u => ({
            name: u.category.name,
            parent: u.category.parent,
            score: u.score,
            totalScore: u.category.totalScore,
            level: "Genus"
          })),
        ];
        // Animal list

        const animalData = catalog.animalUserScores || [];

        setAllScores(allData);
        setAnimals(animalData);

        // Start filtering with parent "Mammal" (you had a typo: "Mammal" vs "Mammals")
        setFilteredScores(allData.filter(i => i.parent === "Mammal"));
        setFilteredAnimals([]); // no animals shown initially

      } catch (err) {
        console.error("Error fetching taxonomy:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchTaxonomy();
  }, []);

  const handleCardClick = (name, level) => {
    if (level === "Genus") {
      // Show animals belonging to this genus
      const newAnimals = animals.filter(a => a.genus === name);
      setFilteredAnimals(newAnimals);
      console.log("filteredAnimals", animals);
      setFilteredScores([]); // hide further taxonomy levels
      setPath(prev => [...prev, name]);
    } else {
      // Normal taxonomy drill down
      const newFiltered = allScores.filter(item => item.parent === name);
      setFilteredScores(newFiltered);
      setFilteredAnimals([]); // clear animals list
      setPath(prev => [...prev, name]);
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);

    const currentParent = newPath[newPath.length - 1];

    // If last path is a genus, show animals
    const genusFound = allScores.find(i => i.name === currentParent && i.level === "Genus");

    if (genusFound) {
      const newAnimals = animals.filter(a => a.Genus === currentParent);
      setFilteredAnimals(newAnimals);
      setFilteredScores([]);
    } else {
      const newFiltered = allScores.filter(item => item.parent === currentParent);
      setFilteredScores(newFiltered);
      setFilteredAnimals([]);
    }
  };

  if (loading) return <p className="m-3">Loading...</p>;
  if (error) return <p className="m-3 text-danger">Error: {error}</p>;

  return (
    <div className="m-3">
      <h3 className="mb-3">Your Taxonomy Progress</h3>

      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {path.map((segment, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${index === path.length - 1 ? "active" : ""}`}
              onClick={() => index !== path.length - 1 && handleBreadcrumbClick(index)}
              style={{ cursor: index !== path.length - 1 ? "pointer" : "default" }}
            >
              {segment}
            </li>
          ))}
        </ol>
      </nav>

      {/* Show taxonomy cards */}
      {filteredScores.length > 0 && (
        <div className="row">
          {filteredScores.map((item, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div
                className="card shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCardClick(item.name, item.level)}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <strong>Score:</strong> {item.score} / {item.totalScore}<br />
                    <strong>Level:</strong> {item.level}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show animal cards if genus selected */}
      {filteredAnimals.length > 0 && (
        <div>
          <h4>Animals in Genus: {path[path.length - 1]}</h4>
          <div className="row">
            {filteredAnimals.map((animal, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">{animal.englishName}</h5>
                    <p>
                      <strong>Captured:</strong> {animal.isCaptured ? "Yes" : "No"}
                    </p>
                    <Link
                      to={`/animalwiki/${encodeURIComponent(animal.scientificName)}`}
                    >
                      <button className="btn me-2 btn-primary" >Wiki</button>
                    </Link>

                    <Link
                      to={`/catalog/${userName}/${animal?.englishName}/`}
                    >
                      <button className="btn me-2 btn-primary" >View pictures</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {filteredScores.length === 0 && filteredAnimals.length === 0 && (
        <p>No further classifications found.</p>
      )}
    </div>
  );
}

export default Taxonomy;
