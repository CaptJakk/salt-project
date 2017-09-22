import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  sendTrade
} from '../actionCreators.js';

class Trade extends React.Component {
  constructor (props) {
    super(props);
    this.sendTrade = this.sendTrade.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      tradeOperation: 'BUY',
      tradeOperationMod: 'MARKET',
      asset: 'BTC-USD',
      amount: 0,
      limit: Infinity
    };
  }
  handleInputChange (event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(name, value);
    this.setState({ [name]: value });
  }
  sendTrade (event) {
    event.preventDefault();
    const op = this.state.tradeOperation;
    const opmod = this.state.tradeOperationMod;
    const asset = this.state.asset;
    const amount = this.state.amount;
    const limit = this.state.limit;
    this.props.sendTrade(op, opmod, asset, Number(amount), limit);
  }
  render () {
    return (
      <div>
        <h3>Trade</h3>
        <form onSubmit={this.sendTrade}>
          <strong>Operation</strong><br />
          <input name='tradeOperation' type='radio' value='BUY' checked={this.state.tradeOperation === 'BUY'} onChange={this.handleInputChange} />
          <text>BUY</text><br />
          <input name='tradeOperation' type='radio' value='SELL' checked={this.state.tradeOperation === 'SELL'} onChange={this.handleInputChange} />
          <text>SELL</text><br /><br />
          <strong>Asset</strong><br />
          <input name='asset' type='radio' value='BTC-USD' checked={this.state.asset === 'BTC-USD'} onChange={this.handleInputChange} />
          <text>BTC-USD</text><br />
          <input name='asset' type='radio' value='ETH-BTC' checked={this.state.asset === 'ETH-BTC'} onChange={this.handleInputChange} />
          <text>ETH-BTC</text><br />
          <input name='asset' type='radio' value='LTC-BTC' checked={this.state.asset === 'LTC-BTC'} onChange={this.handleInputChange} />
          <text>LTC-BTC</text><br />
          <input name='asset' type='radio' value='DOGE-BTC' checked={this.state.asset === 'DOGE-BTC'} onChange={this.handleInputChange} />
          <text>DOGE-BTC</text><br /><br />
          <strong>Amount</strong><br />
          <input name='amount' type='number' value={this.state.amount} min='0' onChange={this.handleInputChange} />
          <br /><input type='submit' />
        </form>
      </div>
    );
  }
}

Trade.propTypes = {
  sendTrade: PropTypes.func
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      sendTrade
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
