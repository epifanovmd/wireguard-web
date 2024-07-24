import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren } from "react";

interface IProps {}

export const AboutPage: FC<PropsWithChildren<IProps>> = observer(() => {
  return <div>About page</div>;
});
