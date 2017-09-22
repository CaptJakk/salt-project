import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
} from '../actionCreators.js';

class Trade extends React.Component {
  render () {
    return (
      <div>
        <h3>Trade</h3>
      </div>
    );
  }
}

Trade.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
