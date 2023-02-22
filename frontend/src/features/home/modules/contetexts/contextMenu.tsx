import React, { useContext, useState } from 'react';

type ContextMenuContextProps = {
  rename: string;
};

const ContextMenuContext = React.createContext<ContextMenuContextProps>({
  rename: '',
});

const SetContextMenuContext = React.createContext<
  React.Dispatch<React.SetStateAction<ContextMenuContextProps>>
>(() => {});

export const useContextMenuContextState = (): [
  ContextMenuContextProps,
  React.Dispatch<React.SetStateAction<ContextMenuContextProps>>,
] => {
  return [useContext(ContextMenuContext), useContext(SetContextMenuContext)];
};

type ContextMenuContextProviderProps = {
  children: React.ReactNode;
};

export const ContextMenuContextProvider = ({ children }: ContextMenuContextProviderProps) => {
  const [state, setState] = useState<ContextMenuContextProps>({
    rename: '',
  });

  return (
    <ContextMenuContext.Provider value={state}>
      <SetContextMenuContext.Provider value={setState}>{children}</SetContextMenuContext.Provider>
    </ContextMenuContext.Provider>
  );
};
