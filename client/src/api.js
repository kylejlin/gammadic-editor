import secret from "./secret";

export default {
  validatePath(path) {
    return fetch("/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        secret,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((json) => json.isValid);
  },

  readFile(path) {
    return fetch("/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        secret,
      }),
    }).then((res) => {
      if (res.status === 200) {
        return res.text();
      } else {
        throw res;
      }
    });
  },

  writeFile(path, content) {
    return fetch("/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        secret,
        content,
      }),
    }).then((res) => {
      if (res.status === 200) {
        return;
      } else {
        throw res;
      }
    });
  },
};
