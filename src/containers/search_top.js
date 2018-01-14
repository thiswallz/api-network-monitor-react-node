import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultServices } from '../store/api_services';
import { STATUS } from "../store/status";

class SearchTop extends Component {
  constructor(props) {
    super(props);

    this.state = { env:'dev' }
    this.handleChange= this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleChange(event){
    this.setState({ env: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.dispatch(consultServices(this.state.env));
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} className="form-inline">
        <span className="input-group-btn">
          <select value={this.state.env} onChange={this.handleChange} className="form-control mr-sm-3">
            <option value="dev">Development</option>
            <option value="qa">Staging</option>
            <option value="prod">Production</option>
          </select>
          {this.props.servicesStatus===STATUS.FETCHING
            ? <button 
            type="submit" 
            disabled={true}
            className="btn btn-primary my-4 my-sm-0">Loading...</button>
            : <button 
            type="submit" 
            className="btn btn-primary my-4 my-sm-0">Get status</button>
          }
        </span>
      </form>   
    )
  }
}

export default connect(state => {
  return {
    servicesStatus: state.services._status
  }
})(SearchTop)