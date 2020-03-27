import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';

import AlertContext from './alertContext';
import alertReducer from './AlertReducer';

import {
  SET_ALERT,
  REMOVE_ALERT
} from '../types';


const AlertState = props => {
  const initialState = []

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {

    const id = uuid();

    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    })

    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      })
    }, timeout);

  }

  return (
    // All the values that are passed in the 'values' object will be available to the components using the AlertState
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}>
      {props.children},
    </AlertContext.Provider>
  )
}


export default AlertState;