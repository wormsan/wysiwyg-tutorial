import React from 'react'
class Toolbar extends React.Component {
    render () {
        // https://w3c.github.io/editing/execCommand.html
        return <div 
        // 这个地方是个坑
        onMouseDown={(e) => e.preventDefault()} 
        onClick={(e) => {
            const editor = document.querySelector(`#${this.props.id}`)
            document.execCommand('bold', true, '')
            const a = document.queryCommandEnabled('bold')
            console.log(a)
            console.log(document.querySelector(`#${this.props.id}`))
            // document.querySelector(`#${this.props.id}`).execCommand('bold', false, null)
        }}>123</div>
    }
}
export default Toolbar