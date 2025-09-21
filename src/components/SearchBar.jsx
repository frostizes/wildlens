import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AnimalSearchBar({ token, API_BASE_URL, imagePath, onAnimalChanged }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchResultsAnimals, setSearchResultsAnimals] = useState([]);

    // debounce user input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // wait 300ms before firing
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // fetch results when debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery.trim() === "" || debouncedQuery.length < 2) {
            setSearchResultsAnimals([]);
            return;
        }

        const fetchResults = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/Search/${debouncedQuery}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setSearchResultsAnimals(response.data.animals);
            } catch (err) {
                console.error("Error during search:", err);
            }
        };

        fetchResults();
    }, [debouncedQuery, API_BASE_URL, token]);


    const changeAnimalName = async (animalName) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/Profile/changeAnimalOnPicture`,
                {},
                {
                    params: {
                        imagePath: encodeURIComponent(imagePath),
                        newAnimalName: animalName,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            onAnimalChanged();
        } catch (err) {
            console.error("Error during search:", err);
        }
    }

    return (
        <div className="d-flex flex-column align-items-center flex-grow-1">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="d-flex"
                style={{ width: "300px" }}
            >
                <input
                    type="text"
                    className="form-control"
                    placeholder="Find your mammal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            {searchResultsAnimals.length > 0 && searchQuery.trim().length >= 2 && (
                <div
                    className="position-absolute p-3 bg-light rounded shadow overflow-auto"
                    style={{ maxHeight: "200px", width: "500px", top: "70px", zIndex: 1000 }}
                >
                    <ul className="list-group">
                        {searchResultsAnimals.map((animal, index) => (
                            <button
                                className="list-group-item text-dark text-decoration-none custom_link_class"
                                onClick={() => {
                                    changeAnimalName(animal.languageSpecificName);
                                    setSearchQuery("");
                                    setSearchResultsAnimals([]);
                                }}
                            >
                                🐾 {animal.languageSpecificName ?? "Unnamed animal"}
                            </button>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AnimalSearchBar;
