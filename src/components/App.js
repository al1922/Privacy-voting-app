import React from 'react';
import Signup from './auth/Signup';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import PrivateRout from './PrivateRout'
//import PrivateRoutRoom from './PrivateRoutRoom'

import {AuthProvider} from "../contexts/AuthContext"
import {NotificationProvider} from "../contexts/NotificationContext"


import Login from "./auth/Login"
import ForgotPassword from './auth/ForgotPassword'

import Dashboard from "./dashboard/Dashboard"

import Room from './room/Room'

import './App.scss'
import './auth/Auth.scss'

export default function App() {
  return(
   
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
          <Switch>
            <PrivateRout exact path="/" component={Dashboard} />
            <PrivateRout exact path="/room/:id" component={Room} />
            <Route path="/singup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
            </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  
  )}

