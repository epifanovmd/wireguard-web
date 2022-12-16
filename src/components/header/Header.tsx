import React, { FC, memo } from "react";
import styled from "styled-components";

import { Link } from "../link";

export const Header: FC = memo(() => {
  return (
    <HeaderWrap>
      <menu>
        <Items>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/clients">Clients</Link>
          </li>
        </Items>
      </menu>
    </HeaderWrap>
  );
});

const HeaderWrap = styled.div`
  li {
    list-style-type: none;

    &:not(:first-of-type):not(:last-of-type) {
      margin: 0 5px 0 5px;
    }
  }
`;

const Items = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;
