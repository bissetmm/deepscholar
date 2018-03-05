class Api {
  static fetchApi(typeName, options) {
    return fetch(`/api/papers/${typeName}/_search`, options)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(typeName, options, token) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (token) {
      headers.append("authorization", `bearer ${token}`);
    }

    options.body = JSON.stringify(options.body);
    const o = Object.assign({
      accept: "application/json",
      headers,
      method: "post",
      body: null
    }, options);
    return Api.fetchApi(typeName, o);
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
}

export default Api;
