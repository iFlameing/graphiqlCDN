import {
  getFetcher,
  onEditQuery,
  locationQuery,
  onEditVariables,
  queryParameters,
  otherParameters,
  defaultOptions
} from "./helper.js";

const logger = console;

async function renderGraphiql(opts) {
  let options = { ...defaultOptions, ...opts };
  let url = options.url || "";
  let queryString = options.query;
  let variablesString = options.variables
    ? JSON.stringify(options.variables, null, 2)
    : null;
  let resultString = options.result
    ? JSON.stringify(options.result, null, 2)
    : null;

  // Collect the URL parameters
  let parameters = queryParameters();
  let otherParams = otherParameters(parameters);
  options.url = url + locationQuery(otherParams).toString();

  if (!options.fetcher) {
    options.fetcher = await getFetcher(options);
  }

  return ReactDOM.render(
    React.createElement(GraphiQL, {
      fetcher: options.fetcher,
      onEditQuery: onEditQuery,
      onEditVariables: onEditVariables,
      query: queryString,
      response: resultString,
      variables: variablesString
    }),
    document.getElementById(options.containerId)
  );
}

renderGraphiql();
