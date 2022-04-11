import React from 'react';
import { Input } from '@happeouikit/form-elements';
import { IconSearch } from '@happeouikit/icons';

const Search = ({ onSearch, value }) => (
    <Input
        placeholder="Search"
        onChange={({ currentTarget: { value } }) => onSearch(value)}
        icon={IconSearch}
        value={value}
    />
);

export default Search;