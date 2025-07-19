import React from "react";

interface SearchBarProps {
  query: string;
  onChange: (newQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => {
  return (
    <input
      type="text"
      className="form-control mb-3"
      placeholder="Search by file name..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
