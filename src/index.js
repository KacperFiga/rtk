import { applyMiddleware, combineReducers, createStore } from "redux";
import pokemonsReducer, {
  addPokemons,
  fetchData,
  firstMiddleware,
  secondMiddleware
} from "./pokemons";

console.clear();

const reducer = combineReducers({
  pokemons: pokemonsReducer
});

const store = createStore(
  reducer,
  applyMiddleware(firstMiddleware, secondMiddleware)
);
store.subscribe(() => console.log(store.getState()));

console.clear();

store.dispatch(fetchData());
setTimeout(() => store.dispatch(fetchData(2)), 500);
setTimeout(() => store.dispatch(fetchData(5)), 500);
