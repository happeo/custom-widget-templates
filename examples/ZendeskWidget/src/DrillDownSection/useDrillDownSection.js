import { useState, useEffect, useCallback } from "react";
import { getSectionArticles, getCategories, getCategorySections } from "../actions";

const getSectionRequest = (variant) => {
    switch (variant) {
        case 'categories':
            return getCategories;
        case 'category':
            return getCategorySections;
        case 'sections':
        default:
            return getSectionArticles;
    }
};

const getResponseProp = (variant) => {
    switch (variant) {
        case 'categories':
            return 'categories';
        case 'category':
            return 'sections';
        case 'sections':
        default:
            return 'articles';
    }
};

const useDrillDownSection = (widgetApi, id, page = 1, variant = 'sections') => {
    const [state, setState] = useState({});
    const [isFailed, setIsFailed] = useState(false);
    const [currentPage, setCurrentPage] = useState(page);
    const goToPage = useCallback((pageNumber) => setCurrentPage(pageNumber), [setCurrentPage]);

    useEffect(async () => {
        try { 
            const token = await widgetApi.getJWT();
            const sectionRequest = getSectionRequest(variant);
            const requestResult = await sectionRequest(token, currentPage, id);
            const records = requestResult?.[getResponseProp(variant)] || {};

            delete requestResult[variant];
            
            setIsFailed(false);
            setState({ records, ...requestResult });
        } catch (error) {
            setIsFailed(true);
        }
    }, [variant, id, page, widgetApi, currentPage]);

    return {
        state, 
        isFailed,
        goToPage,
    };
};

export default useDrillDownSection;