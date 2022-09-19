import { ActionReducer, INIT } from "@ngrx/store";

import { AppState } from "./app.state";

export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem("cartState");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("cartState");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("cartState", JSON.stringify(nextState));
    return nextState;
  };
};