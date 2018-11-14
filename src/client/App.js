import React, { Component } from 'react';
import axios from 'axios';
import './app.css';
import './bootstrap/css/bootstrap.css';
import ClassifyResult from './ClassifyResult.js';

export default class App extends Component {
  state = {
    username: null,
    text: 'Microsoft\nWalmart\nAmazon',
    result: [],
    error: false,
    loading: false,
  };

  componentDidMount() {
    fetch('/api/getUsername?accessToken=test1')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  /**
   * Update text and classify after one second pause.
   * @param text Text from textarea.
   */
  updateText = (text) => {
    // Classify text one second after finishing typing text.
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ text });
  };

  /**
   * Classify text with settings in state.
   */
  classify() {
    // Call api.
    // Update view.
    this.setState({
      loading: true,
    });
    const { state } = this;
    if (!state.text) {
      this.setState({
        loading: false,
        result: [],
        error: 'Please enter company names to locate domains for',
      });
      return;
    }

    let query = '/api/companies?accessToken=test1&';
    const companies = state.text.split(/\n/);
    for (let i = 0; i < companies.length; i += 1) {
      query += `&companies[]=${companies[i]}`;
    }
    axios.get(query)
      .then((result) => {
        if (result.data.status === 'error') {
          this.setState({
            loading: false,
            result: [],
            error: 'Error loading results',
          });
        } else {
          this.setState({
            loading: false,
            result: result.data.data,
            error: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          result: [],
          error: 'Error loading results',
          loading: false,
        });
      });
  }

  render() {
    const { username } = this.state;
    const { state } = this;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <div className="p-4">
          <textarea
            className="form-control w-100"
            id="text"
            rows="10"
            type="text"
            value={state.text}
            onChange={(e) => { this.updateText(e.target.value); }}
          />
        </div>
        <div className="p-4 mb-3">
          <button type="button" className="btn btn-lg btn-primary" onClick={() => this.classify()}>Find Domains</button>
        </div>
        <div>
          <ClassifyResult
            result={state.result}
            loading={state.loading}
            error={state.error}
          />
        </div>
      </div>
    );
  }
}
