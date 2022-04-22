import React from "react";
import styled from "styled-components";
import { TextBeta } from "@happeouikit/typography";

const Logo = () => {
  return (
    <LogoWrap>
      <svg
        width="30"
        height="22"
        viewBox="0 0 30 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1573_29497)">
          <path
            d="M29.3379 3.29009C29.1658 2.65417 28.8302 2.07442 28.3643 1.60857C27.8985 1.14273 27.3188 0.807038 26.6829 0.634932C24.3548 0 14.985 0 14.985 0C14.985 0 5.6148 0.019219 3.28672 0.654151C2.65079 0.826267 2.07104 1.16197 1.60522 1.62784C1.13939 2.09371 0.803733 2.67348 0.631673 3.30943C-0.0725177 7.44598 -0.345686 13.7491 0.651009 17.7202C0.823087 18.3561 1.15875 18.9359 1.62458 19.4017C2.0904 19.8676 2.67014 20.2033 3.30605 20.3754C5.63413 21.0103 15.0041 21.0103 15.0041 21.0103C15.0041 21.0103 24.374 21.0103 26.702 20.3754C27.3379 20.2033 27.9177 19.8676 28.3835 19.4017C28.8494 18.9359 29.185 18.3561 29.3571 17.7202C30.0999 13.5778 30.3287 7.27863 29.3379 3.29021V3.29009Z"
            fill="#FF0000"
          />
          <path
            d="M12.0029 6.00293V15.0073L19.776 10.5051L12.0029 6.00293Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_1573_29497">
            <rect width="30" height="21.0102" fill="white" />
          </clipPath>
        </defs>
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
