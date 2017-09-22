import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Invites from './Invites.jsx';
import Prices from './Prices.jsx';
import Balances from './Balances.jsx';
import Trade from './Trade.jsx';
import History from './History.jsx';
import {
  sendInvite,
  sendLogout
} from '../actionCreators.js';

class HomePage extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.context.router = context.router;
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout (event) {
    event.preventDefault();
    this.props.sendLogout(this.context.router);
  }
  render () {
    return (
      <div>
        <h1>Welcome to the Virtual Currency Exchange</h1>
        <button onClick={this.handleLogout}>Logout</button>
        <br />
        <Invites />
        <br />
        <Prices />
        <br />
        <Balances />
        <br />
        <Trade />
        <br />
        <History />
      </div>
    );
  }
}

HomePage.propTypes = {
  sendLogout: PropTypes.func
};

HomePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      sendInvite,
      sendLogout
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
