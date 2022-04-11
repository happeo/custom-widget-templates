
import { useEffect, useState, useRef } from 'react';
import { getSearch } from '../actions';

const useSearch = (widgetApi) => {
    const timeout = useRef(null);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        try {
            if (timeout.current) clearTimeout(timeout.current);
            if (!query) throw new Error();

            timeout.current = setTimeout(async () => {
                const token = await widgetApi.getJWT()
                const { results } = await getSearch(token, query);

                setResults(results);
            // 600 is the timeout that we're using to not send requests each time user presses a button
            // can be decreased if it's needed
            }, 600);
        } catch (_) {
            setResults([]);
        }

        return () => clearTimeout(timeout.current);
    }, [query]);

    return { results, onSearch: setQuery, query };
};

export default useSearch;