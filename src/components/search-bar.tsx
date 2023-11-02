import { useDebounceCallback } from "@react-hook/debounce";
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from "react";

interface SearchBarProps {
  onPlaceSelect: (result: any) => void;
  flyToBounds: (bounds: [[number, number], [number, number]]) => void;
}

type Place = {
  place_id: number;
  description: string;
};

const service = new google.maps.places.AutocompleteService();
const sessionToken = new google.maps.places.AutocompleteSessionToken();

const fetchPlaces = (query: string) => {
  return new Promise((resolve, reject) => {
    service.getPlacePredictions(
      { input: query, sessionToken },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus,
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions);
        }
        reject(status);
      },
    );
  });
};

// Restricted API key for this project
const API_KEY = "AIzaSyALn2U5-jll5h_96VoWn2YVe2BO9W1-fAE";
const fetchPlace = async (placeId: string | number) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API_KEY}`,
  );
  return res.json();
};

const SearchBar = ({ onPlaceSelect, flyToBounds }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef(null);

  const runFetchPlaces = (currentQuery: string) => {
    if (currentQuery.length > 2) {
      // Assuming you have a function fetchPlaces to get results from the API
      fetchPlaces(currentQuery).then((data) => setResults(data as any));
    } else {
      setResults([]);
    }
  };

  const debouncedRunFetchPlaces = useDebounceCallback(runFetchPlaces, 500);

  useEffect(() => {
    debouncedRunFetchPlaces(query);
  }, [debouncedRunFetchPlaces, query]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  const handleSelection = async (placeId: string | number) => {
    setQuery("");
    setResults([]);
    const place = await fetchPlace(placeId);
    const viewport = place?.results[0]?.geometry?.viewport;
    if (viewport) flyToBounds([viewport?.northeast, viewport?.southwest]);
    else
      window.alert(
        "Coastal Reef Explorer could not find this location automatically.",
      );
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case "ArrowUp":
        setHighlightedIndex(
          (prevIndex) => (prevIndex - 1 + results.length) % results.length,
        );
        break;
      case "ArrowDown":
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % results.length);
        break;
      case "Enter":
        handleSelection(results[highlightedIndex].place_id);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a place..."
      />
      {results.length > 0 && (
        <ul>
          {results.map((result, index) => (
            <li
              key={result.place_id}
              onClick={() => handleSelection(result.place_id)}
              style={{
                backgroundColor: index === highlightedIndex ? "#eee" : "#fff",
              }}
            >
              {result?.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
