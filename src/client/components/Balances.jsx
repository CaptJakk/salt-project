import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getBalances,
  getValueUsd,
  getValueBtc
} from '../actionCreators.js';

class Balances extends React.Component {
  componentDidMount () {
    this.props.getBalances();
    this.props.getValueUsd();
    this.props.getValueBtc();
  }
  render () {
    const balances = this.props.balances;
    const valueUsd = this.props.valueUsd;
    const valueBtc = this.props.valueBtc;
    return (
      <div>
        <h3>Balances</h3>
        <h6>USD: { balances ? balances.USD : '...' }</h6>
        <h6>BTC: { balances ? balances.BTC : '...' }</h6>
        <h6>ETH: { balances ? balances.ETH : '...' }</h6>
        <h6>LTC: { balances ? balances.LTC : '...' }</h6>
        <h6>DOGE: { balances ? balances.DOGE : '...' }</h6>
        <h5>Value in USD: { valueUsd || '...' }</h5>
        <h5>Value in BTC: { valueBtc || '...' }</h5>
      </div>
    );
  }
}

Balances.propTypes = {
  valueBtc: PropTypes.number,
  valueUsd: PropTypes.number,
  balances: PropTypes.object,
  getBalances: PropTypes.func
};

const mapStateToProps = state => {
  return {
    balances: state.balances,
    valueBtc: state.valueBtc,
    valueUsd: state.valueUsd
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getBalances,
      getValueUsd,
      getValueBtc
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Balances);
