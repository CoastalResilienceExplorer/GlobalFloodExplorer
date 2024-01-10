import { createContext, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { filters, no_filters } from "layers/filters";

export const FiltersContext = createContext({});
export const useFilterContext = () => useContext(FiltersContext);

export function useFilters() {
  const [filtersOn, setFiltersOn] = useState(true);
  const [activeFilters, setActiveFilters] = useState(filters);
  const activeFiltersRef = useRef();

  useEffect(() => {
    if (filtersOn) {
      setActiveFilters(filters);
    } else {
      setActiveFilters(no_filters);
    }
  }, [filtersOn]);

  useEffect(() => {
    activeFiltersRef.current = activeFilters;
  }, [activeFilters]);

  return {
    filtersOn,
    setFiltersOn,
    activeFilters,
    activeFiltersRef,
  };
}
