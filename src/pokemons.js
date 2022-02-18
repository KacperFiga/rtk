const POKEMONS_ACTION_TYPES = {
  ADD: "pokemons/add",
  DELETE: "pokemons/delete",
  FETCH_ERRORS: "pokemons/fetch_errors",
  REMOVE_ALL: "pokemons/remove_all",
  SET_LOADING_STATE: "pokemons/set_loading_state"
};

const defaultState = {
  data: [], // { name: string, url: string }
  offset: 0,
  isPending: false,
  error: null
};

export default function reducer(state = defaultState, { type, payload }) {
  console.log("Jesteśmy w reducerze");
  switch (type) {
    case POKEMONS_ACTION_TYPES.ADD:
      return {
        ...state,
        data: [...state.data, ...payload],
        offset: (state.offset += payload.length)
      };
    case POKEMONS_ACTION_TYPES.DELETE:
      const filteredPokemons = state.data.filter(
        ({ name }) => name !== payload
      );

      return { ...state, data: filteredPokemons, offset: --state.offset };
    case POKEMONS_ACTION_TYPES.REMOVE_ALL:
      return { ...state, data: [], offset: 0 };
    case POKEMONS_ACTION_TYPES.FETCH_ERRORS:
      return { ...state, error: payload };
    case POKEMONS_ACTION_TYPES.SET_LOADING_STATE:
      return { ...state, isPending: payload };
    default:
      return state;
  }
}

const addPokemons = (pokemons = []) => ({
  type: POKEMONS_ACTION_TYPES.ADD,
  payload: pokemons
});

const deletePokemon = (name) => ({
  type: POKEMONS_ACTION_TYPES.DELETE,
  payload: name
});

const removeAllPokemons = () => ({
  type: POKEMONS_ACTION_TYPES.REMOVE_ALL
});

const fetchError = (message) => ({
  type: POKEMONS_ACTION_TYPES.FETCH_ERRORS,
  payload: message
});

const setLoadingState = (state) => ({
  type: POKEMONS_ACTION_TYPES.SET_LOADING_STATE,
  payload: state
});

// Konstrukcja middleware w redux - zagniezdzone 3 funkcje
// - pierwsza przyjmuje obiekt store z metodami dispatch oraz getState
// - druga przyjmuje funkcje next (redux sam wybiera czy to kolejny middleware czy dispatch)
// - trzecia przyjmuje akcje

function firstMiddleware(store) {
  return function (next) {
    return function (action) {
      console.log("Witamy w pierwszym middleware");
      console.log(action);
      return next(action);
    };
  };
}

const secondMiddleware = (store) => (next) => (action) => {
  if (typeof action !== "function") {
    return next(action);
  }

  console.log("Zamiast akcji otrzymaliśmy funkcję");
  // jezeli chcemy przejsc na pewno do dispatcha dajemy dispatch
  // jezeli bysmy chcieli znow kolejny krok lepiej dac "next"
  // poniewaz redux sam wtedy jak bedzie trzeba da dispatcha
  // jak nie to kolejny middleware
  action(store.dispatch, store.getState);
};

function fetchData(howMuchPokemons = 10) {
  return async function (dispatch, getState) {
    try {
      const { pokemons } = getState();

      if (pokemons.isPending) {
        return;
      }

      dispatch(setLoadingState(true));
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${howMuchPokemons}&offset=${pokemons.offset}`
      );
      const { results } = await response.json();

      dispatch(addPokemons(results));
    } catch (error) {
      dispatch(fetchError(error.message));
    } finally {
      dispatch(setLoadingState(false));
    }
  };
}

export {
  addPokemons,
  deletePokemon,
  fetchData,
  firstMiddleware,
  removeAllPokemons,
  secondMiddleware,
  POKEMONS_ACTION_TYPES
};
