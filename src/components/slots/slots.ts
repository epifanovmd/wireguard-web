import { stringUnCapitalize } from "@utils/string";
import * as React from "react";
import { FC, PropsWithChildren, useMemo } from "react";

type ReactComponent<P = any> = (
  | React.FC<P>
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>
) & { readonly $$typeof?: symbol };

type ReactComponentProps<TComponent> =
  TComponent extends React.FunctionComponent<infer P>
    ? P
    : TComponent extends React.ComponentClass<infer P>
      ? P
      : never;

type SlotsProps<TComponent> = {
  [K in Exclude<keyof TComponent, keyof ReactComponent> as `${Uncapitalize<
    string & K
  >}`]?: ReactComponentProps<TComponent[K]>;
};

interface RestChildren {
  $children?: React.ReactNode[];
}

export type SlotType<P extends {}> = React.ComponentType<PropsWithChildren<P>>;

const keyIsSlot = (key: string) => {
  return (
    new RegExp(/^[A-Za-z]$/).test(key[0]) && key[0] === key[0].toUpperCase()
  );
};

export const createSlot = <P extends {}, ST extends SlotType<P> = SlotType<P>>(
  name: string,
  Slot: ST = (({ children }) => children ?? null) as ST,
): ST => {
  Slot.displayName = name;

  return Slot;
};

export function getSlotsProps<
  TComponent extends ReactComponent & {
    [key in keyof Omit<TComponent, keyof ReactComponent>]: SlotType<any>;
  },
>(
  Component: TComponent,
  children: React.ReactNode | React.ReactNode[],
): SlotsProps<TComponent> & RestChildren {
  const result: SlotsProps<TComponent> & RestChildren = {};
  const tmp: any = {};
  const $children: React.ReactNode[] = [];

  for (const child of React.Children.toArray(children)) {
    let isCompound = false;

    if (React.isValidElement(child) && child.type) {
      const displayName = (child.type as FC).displayName;

      if (displayName) {
        if (tmp[displayName]) {
          throw new Error(
            `Duplicate slot detected - ${Component.name}.${displayName}`,
          );
        }
        tmp[displayName] = (child.type as FC).displayName;
      }

      const keys = Object.keys(Component) as (keyof typeof Component & string)[];

      for (const key of keys) {
        if (keyIsSlot(key)) {
          if (
            child.type === Component[key] ||
            (child.type as FC)?.displayName === Component[key]?.displayName
          ) {
            (result as any)[stringUnCapitalize(key)] = child.props;
            isCompound = true;
            break;
          }
        }
      }
    }

    if (!isCompound) {
      $children.push(child);
    }
  }

  return { ...result, $children };
}

export function useSlotProps<
  TComponent extends ReactComponent & {
    [key in keyof Omit<TComponent, keyof ReactComponent>]: SlotType<any>;
  },
>(
  Component: TComponent,
  children: React.ReactNode | React.ReactNode[],
): SlotsProps<TComponent> & RestChildren {
  return useMemo(
    () => getSlotsProps(Component, children),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children],
  );
}
