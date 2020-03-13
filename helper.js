export {
  getFetcher,
  onEditQuery,
  locationQuery,
  onEditVariables,
  queryParameters,
  otherParameters,
  defaultOptions
};

const logger = console;

const defaultOptions = {
  results: "",
  variables: { skip: 3, something: "else", whoever: "bobobbbbobb2" },
  query: "query { allFilms { id title }}",
  url: "https://swapi.graph.cool",
  containerId: "graphiql"
};

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared.
function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}

function updateURL() {
  history.replaceState(null, null, locationQuery(parameters));
}

// Produce a Location query string from a parameter object.
function locationQuery(params) {
  return (
    "?" +
    Object.keys(params)
      .map(function(key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&")
  );
}

function queryParameters() {
  const parameters = {};
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function(entry) {
      const eq = entry.indexOf("=");
      if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
          entry.slice(eq + 1)
        );
      }
    });

  return parameters;
}

// Derive a fetch URL from the current URL, sans the GraphQL parameters.
const graphqlParamNames = {
  query: true,
  variables: true,
  operationName: true
};

function otherParameters(parameters = {}) {
  const otherParams = {};
  for (const k in parameters) {
    if (parameters.hasOwnProperty(k) && graphqlParamNames[k] === true) {
      otherParams[k] = parameters[k];
    }
  }
  return otherParams;
}

const getFetcher = async opts => {
  // only load isomorphic fetch if a fetcher is not provided
  // const { default: fetch } = await import("isomorphic-fetch");
  if (!opts.containerEl || opts.containerId) {
    logger.warn(
      "no containerEl or containerId provided, defaulting to #graphiql"
    );
  }
  if (!opts.url || !opts.fetcher) {
    logger.warn(
      "no url or custom fetcher provided, defaulting to POSTs against https://swapi.graph.cool"
    );
  }
  const resultFn = async graphQLParams => {
    const result = await fetch(opts.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...opts.headers
      },
      body: JSON.stringify(graphQLParams)
    });
    return result.json();
  };
  return resultFn;
};
