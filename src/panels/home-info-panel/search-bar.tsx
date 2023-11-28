import { useDebounceCallback } from "@react-hook/debounce";
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
  useMemo,
  useCallback,
} from "react";
import "./search-bar.css";

type bounds = [[number, number], [number, number]];

interface SearchBarProps {
  onPlaceSelect: (result: any) => void;
  setBounds: (bounds: bounds) => void;
}

type Place = {
  place_id: string;
  description: string;
};

const SearchBar = ({ onPlaceSelect, setBounds }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef(null);

  const AutocompleteService = useMemo(
    () => new google.maps.places.AutocompleteService(),
    [],
  );
  const sessionToken = useMemo(
    () => new google.maps.places.AutocompleteSessionToken(),
    [],
  );
  const Geocoder = useMemo(() => new google.maps.Geocoder(), []);

  const fetchPlace = useCallback(
    async (placeId: string) => {
      const { results } = await Geocoder.geocode({ placeId });
      return results[0];
    },
    [Geocoder],
  );

  const fetchPlaces = useCallback(
    (query: string) => {
      return new Promise((resolve, reject) => {
        AutocompleteService.getPlacePredictions(
          { input: query, sessionToken, types: ["political"] },
          (
            predictions: google.maps.places.AutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus,
          ) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            } else reject(status);
          },
        );
      });
    },
    [AutocompleteService, sessionToken],
  );

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

  const handleSelection = async (placeId: string) => {
    setQuery("");
    setResults([]);
    const place = await fetchPlace(placeId);
    onPlaceSelect?.(place);
    const viewport = place?.geometry?.viewport;
    const northeast = viewport?.getNorthEast();
    const southwest = viewport?.getSouthWest();
    const bounds: bounds = [
      [northeast?.lng(), northeast?.lat()],
      [southwest?.lng(), southwest?.lat()],
    ];
    if (bounds) setBounds(bounds);
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
    <div className="search-container">
      <div className="search-info-text">Search</div>
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a place..."
      />
      {results.length > 0 && (
        <ul className="search-results-container">
          {results.map((result, index) => (
            <li
              key={result.place_id}
              onClick={() => handleSelection(result.place_id)}
              className={`search-result ${
                index === highlightedIndex && "highlighted"
              }`}
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
