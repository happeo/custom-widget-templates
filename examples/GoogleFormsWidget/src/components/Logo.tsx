import React from "react";
import styled from "styled-components";
import { TextBeta } from "@happeouikit/typography";

const Logo = () => {
  return (
    <LogoWrap>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 40 40"
        width="40px"
      >
        <rect x="-4" y="-4" fill="none" width="48" height="48"></rect>
        <g>
          <polygon
            fill="#56368A"
            points="24.5,10 30,11 34.5,10 24.5,0 23.2,4.7"
          ></polygon>
          <path
            fill="#7248B9"
            d="M24.5,10V0H8.2C6.7,0,5.5,1.2,5.5,2.7v34.5c0,1.5,1.2,2.7,2.7,2.7h23.6c1.5,0,2.7-1.2,2.7-2.7V10H24.5z"
          ></path>
          <path
            fill="#FFFFFF"
            d="M13.2,28.9c-0.8,0-1.4-0.6-1.4-1.4c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4 C14.5,28.2,13.9,28.9,13.2,28.9z M13.2,23.4c-0.8,0-1.4-0.6-1.4-1.4s0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4S13.9,23.4,13.2,23.4z M13.2,17.9c-0.8,0-1.4-0.6-1.4-1.4c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4C14.5,17.3,13.9,17.9,13.2,17.9z M28.2,28.6H16.8 v-2.3h11.4V28.6z M28.2,23.2H16.8v-2.3h11.4V23.2z M28.2,17.7H16.8v-2.3h11.4V17.7z"
          ></path>
        </g>
      </svg>
    </LogoWrap>
  );
};

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 157, 255, 0.05),
    0px 1px 4px rgba(186, 198, 208, 0.5);
  border-radius: 6px;
`;

export default Logo;
