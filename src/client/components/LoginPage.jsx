import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setUsername,
  setPassword,
  setConfirmpass,
  setInvitecode,
  sendRegistration,
  sendLogin
} from '../actionCreators.js';

class LoginPage extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.context.router = context.router;
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmpassChange = this.handleConfirmpassChange.bind(this);
    this.handleInvitecodeChange = this.handleInvitecodeChange.bind(this);
    this.goToRegister = this.goToRegister.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }
  handleUsernameChange (event) {
    this.props.setUsername(event.target.value);
  }
  handlePasswordChange (event) {
    this.props.setPassword(event.target.value);
  }
  handleConfirmpassChange (event) {
    this.props.setConfirmpass(event.target.value);
  }
  handleInvitecodeChange (event) {
    this.props.setInvitecode(event.target.value);
  }
  goToRegister (event) {
    event.preventDefault();
    this.props.sendRegistration(this.context.router);
  }
  goToLogin (event) {
    event.preventDefault();
    this.props.sendLogin(this.context.router);
  }
  render () {
    if (this.props.isRegister) {
      return (
        <div>
          <h1>Register</h1>
          <h3>{this.props.error}</h3>
          <form onSubmit={this.goToRegister}>
            <span>Username</span>
            <input onChange={this.handleUsernameChange} value={this.props.username} type='text' placeholder='Username' />
            <br /><span>Password</span>
            <input onChange={this.handlePasswordChange} value={this.props.password} type='password' placeholder='Password' />
            <br /><span>Confirm Password</span>
            <input onChange={this.handleConfirmpassChange} value={this.props.confirmpass} type='password' placeholder='Confirm Password' />
            <br /><span>Invite Code</span>
            <input onChange={this.handleInvitecodeChange} value={this.props.invitecode} type='text' placeholder='Invite Code' />
            <br />
            <input type='submit' />
            <br /><Link to='/login'>Login</Link>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Login</h1>
          <h3>{this.props.error}</h3>
          <form onSubmit={this.goToLogin}>
            <span>Username</span>
            <input onChange={this.handleUsernameChange} value={this.props.username} type='text' placeholder='Username' />
            <br /><span>Password</span>
            <input onChange={this.handlePasswordChange} value={this.props.password} type='password' placeholder='Password' />
            <br /><input type='submit' />
            <br /><Link to='/register'>Register</Link>
          </form>
        </div>
      );
    }
  }
}

LoginPage.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  confirmpass: PropTypes.string,
  invitecode: PropTypes.string,
  error: PropTypes.string,
  isRegister: PropTypes.bool,
  setUsername: PropTypes.func,
  setPassword: PropTypes.func,
  setConfirmpass: PropTypes.func,
  setInvitecode: PropTypes.func,
  sendRegistration: PropTypes.func,
  sendLogin: PropTypes.func
};

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.username,
    password: state.password,
    confirmpass: state.confirmpass,
    invitecode: state.invitecode,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setUsername,
      setPassword,
      setConfirmpass,
      setInvitecode,
      sendRegistration,
      sendLogin
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
