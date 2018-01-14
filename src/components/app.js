import React, { Component } from 'react';
import SearchTop from '../containers/search_top';
import ServiceList from '../containers/service_list';

export default class App extends Component {
  render() {
    return ( 
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand"><img className="logo-img" src={require('../assets/logo.png')}  /></a>
          <SearchTop />
        </nav>
        <ServiceList />
      </div>

    );
  }
}
