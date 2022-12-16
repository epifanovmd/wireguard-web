import React, { FC, memo, PropsWithChildren } from "react";
import styled from "styled-components";

export const Container: FC<PropsWithChildren<{}>> = memo(({ children }) => (
  <HeaderWrap>{children}</HeaderWrap>
));

const HeaderWrap = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 576px) {
    max-width: 540px;
  }

  @media (min-width: 768px) {
    max-width: 720px;
  }

  @media (min-width: 992px) {
    max-width: 940px;
  }

  @media (min-width: 1200px) {
    max-width: 1140px;
  }
`;
