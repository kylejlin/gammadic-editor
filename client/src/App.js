import React from "react";
import "./App.css";
import api from "./api";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.bindMethods();

    this.state = {
      text: "jys yz ju port weir ai sei ai",
      path: "~/Documents/hi.txt",
      isPathValid: false,
    };
    this.pendingPathUpdates = [];

    window.addEventListener("keydown", this.onKeyDown);
  }

  onComponentDidMount() {
    this.validatePath();
  }

  bindMethods() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.validatePath = this.validatePath.bind(this);
  }

  onKeyDown(e) {
    if (e.key === "s" && e.ctrlKey) {
      this.saveIfPathValid();
    }
  }

  saveIfPathValid() {
    if (this.state.isPathValid) {
      this.save();
    }
  }

  save() {
    api.writeFile(this.state.path, this.state.text).then(() => {
      alert("Successfully saved " + this.state.path);
    });
  }

  render() {
    return (
      <div className="App">
        <input
          className={
            this.state.isPathValid ? "Path Path--valid" : "Path Path--invalid"
          }
          type="text"
          value={this.state.path}
          onChange={(e) => {
            this.updatePath(e.target.value);
          }}
        />
        <textarea
          spellCheck={false}
          className="Content"
          value={this.state.text}
          onChange={(e) => {
            this.updateText(e.target.value);
          }}
        />
      </div>
    );
  }

  updateText(text) {
    this.setState({ text });
  }

  updatePath(path) {
    this.setState({ path, text: "..." });
    this.queuePathUpdate(path);
  }

  queuePathUpdate(path) {
    if (this.pendingPathUpdates.length === 0) {
      requestAnimationFrame(this.validatePath);
    }
    this.pendingPathUpdates.push(path);
  }

  validatePath() {
    const latestPath = this.pendingPathUpdates.pop();
    this.pendingPathUpdates = [];
    api.validatePath(latestPath).then((isValid) => {
      this.setState({ isPathValid: isValid });

      if (isValid) {
        api.readFile(latestPath).then((content) => {
          this.setState({ text: content });
        });
      }
    });
  }
}
