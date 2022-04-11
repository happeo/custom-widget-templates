import styled from 'styled-components';

export const StyledDrillDownSection = styled.section`
    min-width: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const StyledDrillDownList = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

export const StyledDrillDownListItem = styled.button`
    &, &:hover, &:focus, &:focus-visible, &:focus-within, &:active {
        all: unset;
    }

    && {
        flex: 0 0 30%;
        cursor: pointer;
        padding: 12px;
        box-sizing: border-box;
        border: 1px solid rgba(0, 20, 100, 0);
        background-color: transparent;
        border-radius: 4px;
        transition: background-color 0.3s ease, border-color 0.3s ease;

        &:hover {
            background-color: rgba(0, 20, 100, 0.1);
        }

        &:focus-visible {
            border-color: rgba(0, 20, 100, 0.2);
        }
    }
`;

export const StyledDrillDownNav = styled.nav`
    display: flex;
    flex-direction: column;
    min-height: 48px;
    line-height: 30px;
    border-bottom: 1px solid rgba(0, 20, 100, 0.1);
    margin-bottom: 16px;
`;

export const StyledPagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-top: 1px solid rgba(0, 20, 100, 0.1);
    padding-top: 16px;
    margin-top: 16px;
`;

export const StyledPageButton = styled.button.attrs(() => ({ type: 'button' }))`
    &, &:hover, &:focus, &:focus-visible, &:focus-within, &:active {
        all: unset;
    }

    && {
        cursor: pointer;
        padding: 8px;
        border: 1px solid rgba(0, 20, 100, 0);
        border-radius: 4px;
        transition: border-color 0.3s ease;

        &:hover, &:focus-visible {
            border-color: rgba(0, 20, 100, 0.4);
        }
    }

    ${({ active }) => active && `
        text-decoration: underline;
    `}
`;

export const StyledGoBackButton = styled.button`
    &, &:hover, &:focus, &:focus-visible, &:focus-within, &:active {
        all: unset;
    }

    && {
        padding: 8px 8px 8px 0;
        cursor: pointer;
        border: 1px solid rgba(0, 20, 100, 0);
        color: rgba(0, 20, 100, 0.2);
        transition: color 0.3s ease, border-color 0.3s ease;
        
        &:hover {
            color: rgba(0, 20, 100, 0.6);
        }

        &:focus-visible {
            border-color: rgba(0, 20, 100, 0.2);
        }

        &:before {
            content: "Go back";
            font-size: 16px;
            font-family: sans-serif, "Arial";
            font-wight: bold;
        }

        ${({ visible }) => !visible && `
            pointer-events: none;
            visibility: hidden;
        `}
    }
`;
