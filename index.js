const express = require("express");
const fs = require("./untildifyingFs");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const allowedHosts = require("./allowedHosts");

const app = express();
app.disable("trust proxy");
app.use(bodyParser.json());

const indexHTMLPath = require("path").join(
  __dirname,
  "client/build/index.html"
);
const indexHTML = fs.readFileSync(indexHTMLPath, "utf8");

let secret = null;

app.get("/", (req, res) => {
  secret = getNewSecret();
  const htmlWithSecret = indexHTML.replace(/__SECRET_PLACEHOLDER__/g, secret);
  res.status(200).send(htmlWithSecret);
});

const PATH_TO_PUBLIC_FILES = require("path").join(__dirname, "client/build/");
app.use(express.static(PATH_TO_PUBLIC_FILES));

app.post("/read", async (req, res) => {
  const { body } = req;
  if (!isFromTrustedHost(req)) {
    res.status(403).send("Untrusted host.");
  } else if (!isSecretValid(body.secret)) {
    res.status(403).send("Invalid secret.");
  } else if ("string" !== typeof body.path) {
    res.status(403).send("Missing path.");
  } else if (!(await isPathFile(body.path))) {
    res.status(404).send("Invalid path.");
  } else {
    readFile(body.path)
      .then((content) => res.status(200).send(content))
      .catch((e) => res.status(500).send(e));
  }
});

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

app.post("/write", async (req, res) => {
  const { body } = req;
  if (!isFromTrustedHost(req)) {
    res.status(403).send("Untrusted host.");
  } else if (!isSecretValid(body.secret)) {
    res.status(403).send("Invalid secret.");
  } else if ("string" !== typeof body.path) {
    res.status(403).send("Missing path.");
  } else if (!(await isPathFile(body.path))) {
    res.status(404).send("Invalid path.");
  } else if ("string" !== typeof body.content) {
    res.status(403).send("Missing content.");
  } else {
    writeFile(body.path, body.content)
      .then(() => res.status(200).end())
      .catch((e) => res.status(500).send(e));
  }
});

app.post("/validate", (req, res) => {
  const { body } = req;
  if (!isFromTrustedHost(req)) {
    res.status(403).send("Untrusted host.");
  } else if (!isSecretValid(body.secret)) {
    res.status(403).send("Invalid secret.");
  } else if ("string" !== typeof body.path) {
    res.status(403).send("Missing path.");
  } else {
    isPathFile(body.path)
      .then((isFile) => res.status(200).json({ isValid: isFile }))
      .catch((err) => res.status(500).send(err));
  }
});

function isFromTrustedHost(req) {
  return allowedHosts.some(
    ({ host, httpsRequired }) =>
      req.hostname === host && (!httpsRequired || req.protocol === "https")
  );
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function isSecretValid(providedSecret) {
  return secret !== null && providedSecret === secret;
}

function getNewSecret() {
  return "secret" + Math.random() + "-" + Math.random() + "-" + uuidv4();
}

function isPathFile(path) {
  if (fs.existsSync(path)) {
    return new Promise((resolve, reject) => {
      fs.lstat(path, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.isFile());
        }
      });
    });
  } else {
    return Promise.resolve(false);
  }
}
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
