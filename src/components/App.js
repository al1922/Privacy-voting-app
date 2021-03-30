import React from 'react';
import Signup from './auth/Signup';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import PrivateRout from './PrivateRout'
import PrivateRoutRoom from './PrivateRoutRoom'

import {AuthProvider} from "../contexts/AuthContext"
import {DatabaseProvider} from "../contexts/DatabaseContext"
import {NotificationProvider} from "../contexts/NotificationContext"


import Login from "./auth/Login"
import ForgotPassword from './auth/ForgotPassword'

import Dashboard from "./dashboard/Dashboard"
import UpdateProfile from './dashboard/UpdateProfile'

import Room from './room/Room'

import './App.scss'
import './auth/Auth.scss'

function App() {
  return(
   
      // <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
      <div className="App">
          <BrowserRouter>
            <AuthProvider>
            <DatabaseProvider>
              <NotificationProvider>
              <Switch>
                <PrivateRout exact path="/" component={Dashboard} />
                <PrivateRout path="/update-profile" component={UpdateProfile} />
                <PrivateRout exact path="/room/:id" component={Room} />
                <Route path="/singup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
               </Switch>
               </NotificationProvider>
               </DatabaseProvider>
            </AuthProvider>
          </BrowserRouter>
      </div>
      // </Container>
  
  )}

export default App;
