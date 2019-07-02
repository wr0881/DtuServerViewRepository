/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import axios from '@/services/axios';
import Server from './Server';

export default class DtuServer extends Component {

  render() {
    return (
      <div>
        <Server url={this.props.match.url}/>
      </div>
    )
  }
}