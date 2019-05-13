import React from "react";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { text: "jys yz ju port weir ai sei ai" };
  }

  render() {
    return (
      <div className="App">
        <textarea
          spellCheck={false}
          className="Gammadic"
          value={this.state.text}
          onChange={e => {
            this.updateText(e.target.value);
          }}
        />
      </div>
    );
  }

  updateText(text) {
    this.setState({ text });
  }
}
