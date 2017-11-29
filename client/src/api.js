class Api {
  static fetchApi(indexName, options) {
    return fetch(`/${indexName}/_search`, options)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(indexName, options) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const o = Object.assign({
      accept: "application/json",
      headers,
      method: "post",
      body: null
    }, options);
    return Api.fetchApi(indexName, o);
  }

  static searchPapers(options) {
    return Api.search("papers", options);
  }

  static searchFigs(options) {
    return Api.search("papers", options);
  }
}

export default Api;