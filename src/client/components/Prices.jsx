import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getPrices
} from '../actionCreators.js';

class Prices extends React.Component {
  constructor (props) {
    super(props);
    this.state = { timer: null };
  }
  componentDidMount () {
    this.props.getPrices();
    this.setState({ timer: window.setInterval(this.props.getPrices, 5000) });
  }
  componentWillUnmount () {
    window.clearInterval(this.state.timer);
    this.setState({ timer: null });
  }
  render () {
    const prices = this.props.prices;
    return (
      <div>
        <h3>Prices</h3>
        <h6>BTC: {prices ? prices.BTC.USD.price : '...'} USD</h6>
        <h6>ETH: {prices ? prices.ETH.BTC.price : '...'} BTC</h6>
        <h6>LTC: {prices ? prices.LTC.BTC.price : '...'} BTC</h6>
        <h6>DOGE: {prices ? prices.DOGE.BTC.price : '...'} BTC</h6>
      </div>
    );
  }
}

Prices.propTypes = {
  getPrices: PropTypes.func,
  prices: PropTypes.object
};

const mapStateToProps = state => {
  return {
    prices: state.prices
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getPrices
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Prices);
