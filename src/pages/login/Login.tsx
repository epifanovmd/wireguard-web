import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import { useLoginVM } from "./hooks/hooks";

export const Login = observer(() => {
  const {
    handleLogin,
    username,
    password,
    handleChangeLogin,
    handleChangePassword,
  } = useLoginVM();

  return (
    <Wrap>
      <Input value={username.value} onChange={handleChangeLogin} />
      <Input value={password.value} onChange={handleChangePassword} />

      <Button onClick={handleLogin}>{"Войти"}</Button>
    </Wrap>
  );
});

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  color: ${({ theme }) => "black" || theme.colors.white};
`;

const Button = styled.div`
  text-align: center;
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid red;
  cursor: pointer;
`;
