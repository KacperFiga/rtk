import { combineReducers, configureStore } from "@reduxjs/toolkit";

import pokemonsReducer, { fetchData } from "./pokemonsToolkit";

console.clear();

const reducer = combineReducers({
  pokemons: pokemonsReducer
});

const store = configureStore({ reducer });
store.subscribe(() => console.log(store.getState()));

store.dispatch(fetchData());
setTimeout(() => store.dispatch(fetchData(2)), 500);
setTimeout(() => store.dispatch(fetchData(5)), 500);
