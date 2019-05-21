import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import Editor from "./editor";
import Toolbar from './ui'
const id = 'editor'
class App extends React.Component {
  componentDidMount () {
    this.forceUpdate()
  }
  render () {
    return (
      <React.Fragment>
        <Toolbar id={id}></Toolbar>
        <Editor id={id}></Editor>
      </React.Fragment>
    );
  }  
}

export default App;
