import React from 'react';
import Signup from './auth/Signup';
import {Container} from 'react-bootstrap'
import {BrowserRouter, Switch, Route} from "react-router-dom"

import PrivateRout from './PrivateRout'

import {AuthProvider} from "../contexts/AuthContext"
import {DataBaseProvider} from "../contexts/DataBaseContext"

import Login from "./auth/Login"
import ForgotPassword from './auth/ForgotPassword'

import Dashboard from "./dashboard/Dashboard"
import UpdateProfile from './dashboard/UpdateProfile'
import CreateRoom from './dashboard/CreateRoom'

import Room from './dashboard/room/Room'



function App() {
  return(
   
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <div className="w-100" style={{maxWidth: "400px"}}>
          <BrowserRouter>
            <AuthProvider>
              <DataBaseProvider>
              <Switch>
                <PrivateRout exact path="/" component={Dashboard} />
                <PrivateRout path="/update-profile" component={UpdateProfile} />
                <PrivateRout path="/creat-room" component={CreateRoom} />
                <PrivateRout path="/room/:id" component={Room} />
                <Route path="/singup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
              </Switch>
              </DataBaseProvider>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </Container>
  
  )}

export default App;
