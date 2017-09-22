import {
  RESET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_CONFIRMPASS,
  SET_INVITECODE,
  SET_ERROR,
  SET_ADMIN,
  SET_INVITES,
  SET_PRICES,
  SET_BALANCES,
  SET_VALUE_USD,
  SET_VALUE_BTC
} from './actions';
const faxios = require('../utils/faxios.js');

export function reset () {
  return { type: RESET };
}
export function setUsername (username) {
  return { type: SET_USERNAME, username };
}
export function setPassword (password) {
  return { type: SET_PASSWORD, password };
}
export function setConfirmpass (confirmpass) {
  return { type: SET_CONFIRMPASS, confirmpass };
}
export function setInvitecode (invitecode) {
  return { type: SET_INVITECODE, invitecode };
}
export function setError (error) {
  return { type: SET_ERROR, error };
}
export function setAdmin (admin) {
  return { type: SET_ADMIN, admin };
}
export function setInvites (invites) {
  return { type: SET_INVITES, invites };
}
export function setPrices (prices) {
  return { type: SET_PRICES, prices };
}
export function setBalances (balances) {
  return { type: SET_BALANCES, balances };
}
export function setValueUsd (valueUsd) {
  return { type: SET_VALUE_USD, valueUsd };
}
export function setValueBtc (valueBtc) {
  return { type: SET_VALUE_BTC, valueBtc };
}

export function sendRegistration (router) {
  return (dispatch, getState) => {
    const state = getState();
    const { username, password, confirmpass, invitecode } = state;
    const body = { username, password, confirmpass, invitecode };
    faxios.post2('/api/register', body).done((err, res) => {
      dispatch(reset());
      if (err) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError(''));
        window.sessionStorage.setItem('userid', res.data.userid);
        window.sessionStorage.setItem('username', res.data.username);
        window.sessionStorage.setItem('admin', res.data.admin);
        window.sessionStorage.setItem('jwt', res.data.jwt);
        if (res.data.admin) {
          dispatch(setAdmin(true));
        }
      }
      router.history.push('/');
    });
  };
}

export function sendLogin (router) {
  return (dispatch, getState) => {
    const state = getState();
    const { username, password } = state;
    const body = { username, password };
    faxios.post2('/api/login', body).done((err, res) => {
      dispatch(reset());
      if (err) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError(''));
        window.sessionStorage.setItem('userid', res.data.userid);
        window.sessionStorage.setItem('username', res.data.username);
        window.sessionStorage.setItem('admin', res.data.admin);
        window.sessionStorage.setItem('jwt', res.data.jwt);
        if (res.data.admin) {
          dispatch(setAdmin(true));
        }
      }
      router.history.push('/');
    });
  };
}

export function sendLogout (router) {
  return (dispatch, getState) => {
    dispatch(reset());
    window.sessionStorage.removeItem('userid');
    window.sessionStorage.removeItem('username');
    window.sessionStorage.removeItem('admin');
    window.sessionStorage.removeItem('jwt');
    router.history.push('/');
  };
}

export function sendInvite () {
  return (dispatch, getState) => {
    const body = {};
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.post3('/api/invite', body, headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        const newInvites = getState().invites.slice();
        newInvites.push(res.data.invitecode);
        dispatch(setInvites(newInvites));
      }
    });
  };
}

export function getInvites () {
  return (dispatch, getState) => {
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.get('/api/invite', headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(setInvites(res.data));
      }
    });
  };
}

export function getPrices () {
  return (dispatch, getState) => {
    console.log('Fetching Prices');
    faxios.get('/api/prices', {}).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(setPrices(res.data));
      }
    });
  };
}

export function getBalances () {
  return (dispatch, getState) => {
    console.log('Fetching Balances');
    const username = window.sessionStorage.getItem('username');
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.get(`/api/${username}/balances`, headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(setBalances(res.data));
      }
    });
  };
}

export function getValueUsd () {
  return (dispatch, getState) => {
    console.log('Fetching USD Value');
    const username = window.sessionStorage.getItem('username');
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.get(`/api/${username}/portfolio/value/USD`, headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(setValueUsd(res.data.value));
      }
    });
  };
}

export function getValueBtc () {
  return (dispatch, getState) => {
    console.log('Fetching BTC Value');
    const username = window.sessionStorage.getItem('username');
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.get(`/api/${username}/portfolio/value/BTC`, headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(setValueBtc(res.data.value));
      }
    });
  };
}

export function sendTrade (op, opmod, asset, amount, limit) {
  return (dispatch, getState) => {
    console.log('Posting Trade');
    console.log(typeof amount);
    const username = window.sessionStorage.getItem('username');
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    const body = {
      asset,
      amount,
      limit: opmod === 'MARKET' ? undefined : limit
    };
    faxios.post3(`/api/${username}/${op.toLowerCase()}/${opmod.toLowerCase()}`, body, headers).done((err, res) => {
      if (err) {
        console.error(err);
        dispatch(setError(err.message));
      } else {
        dispatch(getBalances());
      }
    });
  };
}
