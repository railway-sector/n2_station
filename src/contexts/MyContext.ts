import { createContext } from "react";

type MyDropdownContextType = {
  stations: any;
  updateStations: any;
};

const initialState = {
  stations: undefined,
  updateStations: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
