class Api {
  static fetchApi(options) {
    return fetch("/_search", options)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(options) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const o = Object.assign({
      accept: "application/json",
      headers,
      method: "post",
      body: null
    }, options);
    return Api.fetchApi(o);
  }
}

export default Api;