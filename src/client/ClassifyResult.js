import React from 'react';
import PropTypes from 'prop-types';

/**
 * Render classification result.
 */
export default class ClassifyResult extends React.Component {
  static propTypes = {
    result: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      result: props.result,
      loading: false,
    };
  }


  static getDerivedStateFromProps(nextProps) {
    return {
      result: nextProps.result,
      loading: nextProps.loading,
    };
  }

  render() {
    const { state } = this;
    if (state.loading) {
      // Display spinner for loading classification.
      return (
        <div className="p-4">
          <div className="text-center p-0">
            <b>Loading</b>
            <div className="loader mx-auto" />
          </div>
        </div>);
    }
    if (state.error) {
      return <div><h3>Error loading predictions</h3></div>;
    }
    if (state.result) {
      const items = state.result
        .map(item => (
          <div className="row" key={item.name}>
            <div className="col text-left"><b>{item.name}</b></div>
            <div className="col text-left">
              <a href={`http://${item.domain}`} target="_blank" rel="noopener noreferrer">
                {item.domain}
              </a>
            </div>
          </div>));
      return (
        <div className="p-4 w-50 mx-auto">
          {items}
        </div>);
    }
    return null;
  }
}
