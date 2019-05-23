import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import Editor from "./editor";
import Toolbar, {Button} from './ui'
const id = 'editor'
class App extends React.Component {
  state = {
    editable: true,
    copyWithStyle: true,
  }
  componentDidMount () {
    this.forceUpdate()
  }
  render () {
    return (
      <React.Fragment>
        <Button
          className={this.state.editable && 'active'}
          onClick={() => {
            this.setState(({editable}) => {
              return {
                editable: !editable,
              }
            })
          }}
        >{this.state.editable ? '开启' : '关闭'}编辑功能</Button>
         <Button
          className={this.state.copyWithStyle && 'active'}
          onClick={() => {
            this.setState(({copyWithStyle}) => {
              return {
                copyWithStyle: !copyWithStyle,
              }
            })
          }}
        >{this.state.copyWithStyle ? '' : '不'}粘贴样式</Button>
        <Toolbar id={id}></Toolbar>
        <Editor copyWithStyle={this.state.copyWithStyle} editable={this.state.editable} id={id}></Editor>
      </React.Fragment>
    );
  }  
}

export default App;
