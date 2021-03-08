import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from "./pages/Login";
import { NotFoundPage } from './pages/NotFoundPage';
import { UserMaster } from './pages/UserMaster';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";


function App() {

  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="App">
      <Router>
        <SideBar
          collapsed={collapsed}
        />
        <Container style={{width: '100%', maxWidth: '100%'}}>
          <HeaderInfo handleCollapsedChange={handleCollapsedChange} />
          <Switch>
            
            <PrivateRoute  exact path="/user-master" component={UserMaster}/>
        
            <Route path="*" component={NotFoundPage} />
            <Redirect to="/404" />
          </Switch>
        </Container>
      </Router>
    </div>
  );

}

export default App;