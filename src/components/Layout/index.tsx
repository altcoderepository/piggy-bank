import { Typography as T } from "antd";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode,
}

export const Layout:FC<Props> = ({ children }) => (
  <div>
    <T.Title>Piggy bank</T.Title>
    {children}
  </div>
)