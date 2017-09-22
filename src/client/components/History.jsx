import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
} from '../actionCreators.js';

class History extends React.Component {
  render () {
    return (
      <div>
        <h3>History</h3>
      </div>
    );
  }
}

History.propTypes = {
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
