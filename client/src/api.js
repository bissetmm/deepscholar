class Api {
  static fetchApi(path, options, token) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (token) {
      headers.append("authorization", `bearer ${token}`);
    }

    const o = Object.assign({
      accept: "application/json",
      headers
    }, options);

    return fetch(path, o)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(typeName, options, token) {
    options.body = JSON.stringify(options.body);
    const o = Object.assign({
      method: "post",
      body: null
    }, options);
    const path = `/api/papers/${typeName}/_search`;
    return Api.fetchApi(path, o, token);
  }

  static searchText(options, token) {
    return Api.search("text", options, token);
  }

  static searchFigs(options) {
    return Api.search("figs", options);
  }

  static searchTables(options) {
    return Api.search("tables", options);
  }

  static verify(token) {
    return Api.fetchApi("/api/auth/verify", {}, token);
  }
}

export default Api;
