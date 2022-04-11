import React, { useMemo } from 'react';
import { TinyText, TextEta, TextGamma } from '@happeouikit/typography';
import useDrillDownSection from './useDrillDownSection';
import { StyledDrillDownSection, StyledDrillDownList, StyledDrillDownNav, StyledGoBackButton, StyledDrillDownListItem } from './styles';
import Pagination from './Pagination';
import Search from '../Search';
import useSearch from '../Search/useSearch';

// Section's list builder
const getSections = ({ onSectionClick, list }) => {
    return list?.map(({ name, description, id }, index) =>  (
        <StyledDrillDownListItem onClick={() => onSectionClick(id, name)} key={`items-${index}`}>
            <TextEta>{name}</TextEta>
            <TinyText color="grey">{description}</TinyText>
        </StyledDrillDownListItem>
    ))
};

const Section = ({ widgetApi, onGoBack, id, onSearchResultClick, onSectionClick, variant = 'sections', name = 'Categories', page = 0 }) => {
    const { state, isFailed, goToPage } = useDrillDownSection(widgetApi, id, page, variant);
    const { results, onSearch, query } = useSearch(widgetApi);

    const sectionList = useMemo(() => {
        if (!('page' in state)) return null;

        return getSections({ list: state.records, onSectionClick });
    }, [state, onSectionClick]);
    const searchResults = useMemo(() => {
        if (!results.length) return null;

        return getSections({ list: results, onSectionClick: onSearchResultClick });
    }, [results, onSearchResultClick]);
    const isSearch = !!results.length;

    if (isFailed) return 'Something went wrong';

    return (
        <StyledDrillDownSection>
            <Search onSearch={onSearch} value={query} />

            <StyledDrillDownNav>
                <StyledGoBackButton visible={variant !== 'categories'} onClick={onGoBack} />
                <TextGamma color="grey">{isSearch ? 'Search' : name}</TextGamma>
            </StyledDrillDownNav>

            <StyledDrillDownList>
                {isSearch ? searchResults : sectionList}
            </StyledDrillDownList>

            {!isSearch && (
                <Pagination totalPages={state.page_count} currentPage={state.page} onPageClick={goToPage}/>
            )}
        </StyledDrillDownSection>
    );
};

export default Section;