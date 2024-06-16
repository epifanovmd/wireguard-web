import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RoutePaths } from "../../routes";
import { IAuthService } from "../../service";

export const LoginComponent = () => {
  const [username, setLogin] = useState("string");
  const [password, setPassword] = useState("string");

  const authService = useRef(IAuthService.getInstance()).current;
  const navigate = useNavigate();

  const handleChangeLogin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLogin(event.target.value);
    },
    [],
  );

  const handleChangePassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    authService
      .login({
        username,
        password,
      })
      .then(res => {
        if (res.data) {
          navigate(RoutePaths.ROOT);
        }
      });
  }, [authService, username, navigate, password]);

  return (
    <Wrap>
      <Input value={username} onChange={handleChangeLogin} />
      <Input value={password} onChange={handleChangePassword} />

      <Button onClick={handleSubmit}>{"Войти"}</Button>
    </Wrap>
  );
};

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
