import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
  useMemo,
  useCallback,
} from "react";
import "./search-bar.css";
import { UpdateHeightFunc } from "panels/layer-selection/layer-selection";

export type Bounds = [[number, number], [number, number]];

interface SearchBarProps {
  onPlaceSelect?: (result: any) => void;
  setBounds: (bounds: Bounds) => void;
  updateHeight: UpdateHeightFunc;
  hovered: boolean;
}

type Place = {
  place_id: string;
  description: string;
};

const SearchBar = ({
  onPlaceSelect,
  setBounds,
  updateHeight,
  hovered,
}: SearchBarProps) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[] | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const [google, setGoogle] = useState(window.google);

  useEffect(() => {
    if (!google) {
      const checkGoogle = () => {
        if (window.google && !google) {
          setGoogle(window.google);
        }
      };

      const timeout1 = setTimeout(checkGoogle, 5000);
      const timeout2 = setTimeout(checkGoogle, 10000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [google]);

  const AutocompleteService = useMemo(
    () => (google ? new google.maps.places.AutocompleteService() : null),
    [google],
  );
  const sessionToken = useMemo(
    () => (google ? new google.maps.places.AutocompleteSessionToken() : null),
    [google],
  );
  const Geocoder = useMemo(
    () => (google ? new google.maps.Geocoder() : null),
    [google],
  );

  const fetchPlace = useCallback(
    async (placeId: string) => {
      if (!Geocoder) return;
      const { results } = await Geocoder.geocode({ placeId });
      return results[0];
    },
    [Geocoder],
  );

  const fetchPlaces = useCallback(
    (query: string) => {
      return new Promise<google.maps.places.AutocompletePrediction[] | null>(
        (resolve, reject) => {
          if (!AutocompleteService) return;
          AutocompleteService.getPlacePredictions(
            {
              input: query,
              sessionToken: sessionToken ?? undefined,
              // TODO: ADD admin area levels 2 and 3 when max zoom control is in place
              types: ["country", "administrative_area_level_1"],
            },
            (
              predictions: google.maps.places.AutocompletePrediction[] | null,
              status: google.maps.places.PlacesServiceStatus,
            ) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK ||
                status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              ) {
                resolve(predictions);
              } else {
                reject(status);
              }
            },
          );
        },
      );
    },
    [
      AutocompleteService,
      google?.maps?.places.PlacesServiceStatus.OK,
      google?.maps?.places.PlacesServiceStatus.ZERO_RESULTS,
      sessionToken,
    ],
  );

  const runFetchPlaces = async (currentQuery: string) => {
    if (currentQuery.length > 2) {
      setLoading(true);
      // Assuming you have a function fetchPlaces to get results from the API
      const data = await fetchPlaces(currentQuery);
      setLoading(false);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (hovered) {
      updateHeight();
    }
  }, [updateHeight, results, hovered]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
    runFetchPlaces(e.target.value);
  };

  const handleSelection = async (placeId: string) => {
    setQuery("");
    setResults([]);
    const place = await fetchPlace(placeId);
    if (!place) {
      window.alert(
        "Coastal Reef Explorer could not find this location automatically.",
      );
      return;
    }
    onPlaceSelect?.(place);
    const viewport = place?.geometry?.viewport;
    const northeast = viewport?.getNorthEast();
    const southwest = viewport?.getSouthWest();
    const bounds: Bounds = [
      [northeast?.lng(), northeast?.lat()],
      [southwest?.lng(), southwest?.lat()],
    ];
    // TODO: use flyToViewport instead of setBounds and define a maxZoom IF bounds are too small
    if (bounds) setBounds(bounds);
    else
      window.alert(
        "Coastal Reef Explorer could not find this location automatically.",
      );

    updateHeight(20);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (results?.length) {
      switch (e.key) {
        case "ArrowUp":
          setHighlightedIndex(
            (prevIndex) => (prevIndex - 1 + results?.length) % results?.length,
          );
          break;
        case "ArrowDown":
          setHighlightedIndex((prevIndex) => (prevIndex + 1) % results?.length);
          break;
        case "Enter":
          handleSelection(results?.[highlightedIndex].place_id);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="search-container">
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a place..."
      />

      <ul className="search-results-container">
        {results?.length
          ? results.map((result, index) => (
              <li
                key={result.place_id}
                className={`search-result ${
                  index === highlightedIndex && "highlighted"
                }`}
              >
                <button onClick={() => handleSelection(result.place_id)}>
                  {result?.description}
                </button>
              </li>
            ))
          : null}
        {loading && <li className="search-result">Loading...</li>}
        {query.length > 2 && !loading && !results?.length && (
          <li className="search-result">No results found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
