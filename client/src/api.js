class Api {
  static fetchApi(path) {
    return fetch(path, {accept: "application/json"})
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((json) => json)
      .catch(console.log);
  }

  static search(query) {
    return Api.fetchApi(`/api/search?${query}`);
  }
}

export default Api;