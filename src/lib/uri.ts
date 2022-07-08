export function addParamsToUrl(
  self: string,
  queryParams: { [x: string]: string | number }
) {
  var querystring = self.split("?");
  const allParams: { [x: string]: string } = {};

  if (querystring.length > 1) {
    var pairs = querystring[1].split("&");
    for (let i in pairs) {
      var keyVal = pairs[i].split("=");
      allParams[keyVal[0]] = keyVal[1];
    }
  }

  if (queryParams) {
    Object.keys(queryParams).forEach(
      (k) => (allParams[k] = queryParams[k].toString())
    );
  }

  return `${querystring[0]}?${Object.keys(allParams)
    .map((k) => `${k}=${allParams[k]}`)
    .join("&")}`;
}
