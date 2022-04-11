import React, { useReducer } from 'react';
import Section from './Section';
import Article from '../Article';

const reducer = (state, { type, payload: { id, name, type: sectionType } = {} }) => {
    switch (type) {
        case 'OPEN_CATEGROY':
            return [
                { id, name, type: 'category' },
            ];
        case 'BACK':
            return [...state.splice(0, state.length - 1)];
        case 'BACK_TO_FIRST':
            return [];
        case 'OPEN_SECTION':
        default:
            return [
                ...state,
                { id, name, type: sectionType || 'section' },
            ];
    }
};

// Determines how the level should look like and which method should be called (useDrillDownSection) to retrieve it
const getVariant = (length) => {
    switch (length) {
        case 1:
            return 'category';
        case 2:
            return 'sections';
        case 0:
        default:
            return 'categories';
    }
};

const DrillDownSection = ({ widgetApi }) => {
    const [state, dispatch] = useReducer(reducer, []);
    const onOpenCategory = (id, name) => dispatch({ type: 'OPEN_CATEGROY', payload: { id, name } });
    const onOpenSection = (id, name, type) => dispatch({ type: 'OPEN_SECTION', payload: { id, name, type } });
    const onGoBack = () => dispatch({ type: 'BACK' });
    const onGoBackToFirst = () => dispatch({ type: 'BACK_TO_FIRST' });
    const { id: lastId, name, type } = state[state.length - 1] || {};
    const getSectionMethod = (length) => {
        switch (length) {
            case 'section':
                return (id, name) => onOpenSection(id, name, 'article');
            case 'category':
            case 'sections':
            case 'searchResult':
                return onOpenSection;
            default:
                return onOpenCategory;
        }
    };
    const isSearchResults = type === 'searchResult';

    // In case of article in section or search result click Article should appear
    if (type === 'article' || isSearchResults) return <Article widgetApi={widgetApi} id={lastId} onGoBack={isSearchResults ? onGoBackToFirst : onGoBack} />;

    // TODO create context to avoid widgetApi prop drilling
    return (
        <Section 
            widgetApi={widgetApi} 
            variant={getVariant(state.length)} 
            onSectionClick={getSectionMethod(type)} 
            onSearchResultClick={(id, name) => onOpenSection(id, name, 'searchResult')}
            id={lastId}
            name={name}
            onGoBack={onGoBack}
        />
    );
};

export default DrillDownSection;