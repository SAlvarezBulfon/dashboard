import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface Props {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Buscar..."
      value={searchQuery}
      onChange={handleSearchChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {searchQuery && (
              <IconButton onClick={handleClearSearch} edge="end">
                <CloseIcon />
              </IconButton>
            )}
            <IconButton edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchBar;