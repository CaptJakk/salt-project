import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getInvites,
  sendInvite
} from '../actionCreators.js';

class Invites extends React.Component {
  constructor (props) {
    super(props);
    this.handleInvite = this.handleInvite.bind(this);
  }
  handleInvite (event) {
    event.preventDefault();
    this.props.sendInvite();
  }
  componentDidMount () {
    if (this.props.invites.length === 0 && this.props.admin) {
      this.props.getInvites();
    }
  }
  render () {
    if (!this.props.admin) {
      return (<div />);
    }
    const listItems = this.props.invites.map(invite => <li key={invite}>{invite}</li>);
    return (
      <div>
        <h3>Invites</h3>
        <button onClick={this.handleInvite}>Invite</button>
        <br />
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
}

Invites.propTypes = {
  admin: PropTypes.bool,
  invites: PropTypes.arrayOf(PropTypes.string),
  getInvites: PropTypes.func,
  sendInvite: PropTypes.func
};

const mapStateToProps = state => {
  return {
    admin: state.admin,
    invites: state.invites
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getInvites,
      sendInvite
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Invites);
