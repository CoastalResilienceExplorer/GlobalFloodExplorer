import { useDebounceCallback } from "@react-hook/debounce";
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
  useCallback,
} from "react";

interface SearchBarProps {
  onPlaceSelect: (result: any) => void;
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
      {
        types: ["countries", "cities"],
        input: query,
        sessionToken,
      },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus,
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(predictions);
          resolve(predictions);
        }
        reject(status);
      },
    );
  });
};

const SearchBar = ({ onPlaceSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef(null);

  // Simplified initialization of the Google Maps Places API library
  // from https://github.com/wellyshen/use-places-autocomplete/blob/master/src/usePlacesAutocomplete.ts
  const [ready, setReady] = useState(false);
  const asRef = useRef<google.maps.places.AutocompleteService>();

  const init = useCallback(() => {
    if (asRef.current) return;

    const { google } = window;
    const placesLib = google?.maps?.places;

    if (!placesLib) {
      console.error("Google Maps Places API library must be loaded.");
      return;
    }

    asRef.current = new placesLib.AutocompleteService();
    setReady(true);
  }, []);

  useEffect(() => {
    const { google } = window;
    if (!google?.maps && !(window as any)["init"]) {
      (window as any)["init"] = init;
    } else {
      init();
    }
  }, [init]);

  const runFetchPlaces = (currentQuery: string) => {
    if (currentQuery.length > 2) {
      // Assuming you have a function fetchPlaces to get results from the API
      fetchPlaces(currentQuery).then((data) => setResults(data as any));
    } else {
      setResults([]);
    }
  };

  const debouncedRunFetchPlaces = useDebounceCallback(runFetchPlaces, 1000);

  useEffect(() => {
    debouncedRunFetchPlaces(query);
  }, [debouncedRunFetchPlaces, query]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
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
        onPlaceSelect(results[highlightedIndex]);
        setQuery("");
        setResults([]);
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
              key={result?.place_id}
              onClick={() => onPlaceSelect(result)}
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
