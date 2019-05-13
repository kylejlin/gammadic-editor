const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const allowedHosts = require("./allowedHosts");

const PATH_TO_PUBLIC_FILES = require("path").join(__dirname, "client/build/");

const app = express();
app.use(express.static(PATH_TO_PUBLIC_FILES));
app.disable("trust proxy");
app.use(bodyParser.json());

const indexHTMLPath = require("path").join(
  __dirname,
  "client/build/index.html"
);
const indexHTML = fs.readFileSync(indexHTMLPath, "utf8");

const NULL_VALUE = "__SECRET_NULL__";
let secret = NULL_VALUE;

app.get("/", (req, res) => {
  secret = getNewSecret();
  res
    .status(200)
    .send(indexHTML.replace(/__SECRET_PLACEHOLDER__/g, JSON.stringify(secret)));
});

app.get("/read", (req, res) => {
  const { body } = req;
  if (!isFromTrustedHost(req)) {
    res.status(403).send("Untrusted host.");
  } else if (!isSecretValid(req)) {
    res.status(403).send("Invalid secret.");
  } else if ("string" !== typeof body.path) {
    res.status(403).send("Missing path.");
  } else if (!fs.existsSync(body.path)) {
    res.status(404).send("Invalid path.");
  } else {
    readFile(path)
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

app.post("/write", (req, res) => {
  const { body } = req;
  if (!isFromTrustedHost(req)) {
    res.status(403).send("Untrusted host.");
  } else if (!isSecretValid(req)) {
    res.status(403).send("Invalid secret.");
  } else if ("string" !== typeof body.path) {
    res.status(403).send("Missing path.");
  } else if (!fs.existsSync(body.path)) {
    res.status(404).send("Invalid path.");
  } else if ("string" !== typeof body.content) {
    res.status(403).send("Missing content.");
  } else {
    writeFile(path, contents)
      .then(() => res.status(200).end())
      .catch((e) => res.status(500).send(e));
  }
});

function isFromTrustedHost(req) {
  return allowedHosts.some(
    ({ host, httpsRequired }) =>
      req.hostname === host && (!httpsRequired || req.protocol === "https")
  );
}

function writeFile(path, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contents, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function isSecretValid(req) {
  return secret !== NULL_VALUE && req.body.secret === secret;
}

function getNewSecret() {
  return "secret" + Math.random() + "-" + Math.random() + "-" + uuidv4();
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
