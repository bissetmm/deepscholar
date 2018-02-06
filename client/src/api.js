class Api {
  static fetchApi(indexName, options) {
    return fetch(`/api/${indexName}/_search`, options)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(indexName, options, token) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (token) {
      headers.append("authorization", `bearer ${token}`);
    }

    const o = Object.assign({
      accept: "application/json",
      headers,
      method: "post",
      body: null
    }, options);
    return Api.fetchApi(indexName, o);
  }

  static searchPapers(options, token) {
    return Api.search("papers", options, token);
  }

  static searchFigs(options) {
    return Api.search("figs", options);
  }

  static searchTables(options) {
    return Api.search("tables", options);
  }
}

export default Api;
