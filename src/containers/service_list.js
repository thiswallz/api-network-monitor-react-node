import React, { Component } from 'react';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultServices } from '../store/api_services';
import OrderLinkItem from '../components/order';
import { STATUS } from "../store/status";

class ServiceList extends Component {
  constructor(props) {
    super(props);

    this.state = { order:'name', sort:'asc', detail: {}};
    this.onOrderData = this.onOrderData.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  onOrderData(order, event) {
    event.preventDefault();
    if(!this.props.activeEnv){
      return;
    }
    const sort = this.state.sort=='asc' ? 'desc': 'asc';
    this.setState({ sort, order });
    this.props.consultServices(this.props.activeEnv, order, sort);
  }

  onViewDetail = ({ id, status }, event) => {
    event.preventDefault();
    this.setState({
      detail: {
        ...this.state.detail, 
        [id]: status 
      }
    });
  }

  renderList(serviceData) {
    return ([
      <tr key={shortid.generate()}>
        <th scope="row">
          <span className="badge badge-primary sbadge">{serviceData.type.toUpperCase()} </span> {serviceData.name} 
        </th>
        <td> 
          {serviceData.description} 
        </td>
        <td>{serviceData.success
            ? <span className="badge badge-success sbadge">Success</span>
            : <span>
                <span className="badge badge-danger sbadge">Error</span>
                <span className="badge badge-dark sbadge">{serviceData.errorType}</span>
              </span>
        } </td>
        <td className="text-warning">{serviceData.time}</td>
        <td>
          {!this.state.detail[serviceData.index]
            ? <a href="#" className="btn btn-outline-primary" onClick={(e) => this.onViewDetail({status: true, id: serviceData.index }, e)}>View</a>
            : <a href="#" className="btn btn-outline-warning" onClick={(e) => this.onViewDetail({status: false, id: serviceData.index }, e)}>Close</a>
          }
        </td>
      </tr>,  
      this.state.detail[serviceData.index] 
      ? <tr className="bg-info">
          <td colSpan={5}>
            Raw response: <hr />
            <code>
              {JSON.stringify(serviceData.message)}
            </code>
          </td>
        </tr>
      : null
    ]);
  }

  render() {   
    return (
      <table className="table table-striped table-dark"> 
        <thead>
          <tr>
            <th><OrderLinkItem onOrderData={this.onOrderData} sort={this.state.sort} name="Name" current={this.state.order} /></th>
            <th>Description</th>
            <th>Status</th>
            <th>Time(ms)</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {this.props.status===STATUS.FETCHED ? this.props.services.map(this.renderList) : null}
        </tbody>
      </table>
    )
  }
}

export default connect(state => {
  return {
    services: state.services.payload,
    status: state.services._status
  }
})(ServiceList);
