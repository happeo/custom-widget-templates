import React, { useMemo } from 'react';
import { StyledPageButton, StyledPagination } from '../styles';

const Pagination = ({ currentPage, totalPages, onPageClick }) => {
    const isPage = typeof currentPage === 'number';
    const pageButtons = useMemo(() => {
        if (!isPage) return null;

        const pages = new Array(Number.parseInt(totalPages || 0, 10)).fill(null);

        return pages.map((_, index) => (
            <StyledPageButton active={currentPage === index} key={`pagination-button-${index}`} onClick={() => onPageClick(index + 1)}>{index + 1}</StyledPageButton>
        ));
    }, [currentPage, totalPages, onPageClick]);

    return (
        <StyledPagination>
            {pageButtons}
        </StyledPagination>
    );
};

export default Pagination;