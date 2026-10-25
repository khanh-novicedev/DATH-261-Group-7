import React from 'react';
import { SearchBar as SharedSearchBar } from '../../shared/components/SearchBar';

export interface SearchbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Searchbar: React.FC<SearchbarProps> = ({
  value,
  onChange,
  placeholder = 'Search by User, Content, Reason or Page...',
  className = 'relative flex-1',
}) => {
  return (
    <SharedSearchBar
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default Searchbar;
