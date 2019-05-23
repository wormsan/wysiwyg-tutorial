import React from 'react'
import styled, {css} from 'styled-components'
function withModal (Comp) {
    return class extends React.Component {
        render () {
            const props = this.props
            return (
                <div css={css`
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,.5);
                    display: ${props.visible ? 'flex' : 'none'};
                    justify-content: center;
                    align-items: center;
                `}>
                    <div css={css`
                        width: 320px;
                        /* height: 110px; */
                        background: #fff;
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        border-radius: 4px;
                    `}
                    >
                        <div css={css`
                        flex:1;
                        display: flex;
                        `}>
                            <Comp ref={'content'} {...props}></Comp>
                        </div>
                        <div css={css`
                            height: 40px;
                            display: flex;
                            align-items: center;
                            margin-top: 10px;
                        `}
                        >
                        <Button
                            onClick={() => {
                                const value = this.refs.content.getValue()
                                props.onOk(value)
                            }}
                        css={css`
                            flex: 1;
                        `}>确定</Button>
                        <Button
                        onClick={() => {
                            props.onCancel()
                        }} css={css`
                            flex: 1;
                        `}>取消</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
const Modal = withModal(class extends React.Component {
    getValue () {
        return  [document.querySelector('#code-editor').value, true]
    }
    render () {
        return  <textarea css={css`
                    width: 100%;
                    height: 100px;
                `}
                id={"code-editor"}
                ></textarea>
    }
})
const FontSizeModal = withModal(class extends React.Component {
    getValue () {
        return  document.querySelector('#font-size-option').value
    }
    render () {
        return  <select
        css={css`
            width: 100%;
            height: 90%;
        `}
         id={"font-size-option"}>
            <option value="7">标题1</option>
            <option value="6">标题2</option>
            <option value="5">标题3</option>
            <option value="3">正文</option>
        </select>
    }
})
const LinkModal = withModal(class extends React.Component {
    getValue () {
        return  document.querySelector('#link-editor').value
    }
    render () {
        return  <input css={css`
                width: 100%;
                height: 20px;
            `}
            id={"link-editor"}
            value={"https://36kr.com"}
            ></input>
    }
})

const btnStyle = css`
    height: 30px;
    min-width: 100px;
    border: 1px solid #007bff;
    color: #007bff;
    background-color: #fff;
    border-radius: 4px;
    transition: all .3s;
    margin-right: 5px;
    &.active {
        background-color: #007bff;
        border: 1px solid #007bff;
        color: white;        
    }
    &:hover {
        background-color: #007bff;
        border: 1px solid #007bff;
        color: white;
    }
`

function insertAfter(insert_element,target_element) {
    var parent = target_element.parentNode;
    //最后一个子节点 lastElementChild兼容其他浏览器 lastChild  兼容ie678;
    var last_element = parent.lastElementChild || parent.lastChild;
    //兄弟节点同样也是有兼容性
    var target_sibling = target_element.nextElementSibling || target_element.nextSibling;
    if (last_element == target_element)
    {//先判断目标节点是不是父级的最后一个节点，如果是的话，直接给父级加子节点就好
        parent.appendChild(insert_element);
    }
    else
    {//不是最好后一个节点  那么插入到目标元素的下一个兄弟节点之前（就相当于目标元素的insertafter）
        parent.insertBefore(insert_element,target_sibling);
    }
}
let lastRange = null
const Button = styled.button`${btnStyle}`
class CMDButton extends React.Component {
    execCommand (value, newLine) {
        const selection = window.getSelection()
        if (newLine) {
            const editor = document.querySelector('#editor')
            const lastNode = editor.childNodes[editor.childNodes.length - 1]
            const dd = document.createElement('p')
            dd.appendChild(document.createElement('br'))
            insertAfter(dd, lastNode)
            const newRange = document.createRange()
            newRange.setStart(dd, 0)
            newRange.setEnd(dd, 0)
            selection.rangeCount > 0 && selection.removeAllRanges()
            selection.addRange(newRange)
        } else {
            console.log(lastRange)
            selection.rangeCount > 0 && selection.removeAllRanges()
            selection.addRange(lastRange)
            console.log(selection)

        }
        document.execCommand(this.props.cmd, false, value)
    }
    render () {
        return (
            <button
                css={css`${btnStyle}`}
                onMouseDown={e => e.preventDefault()}
                onClick={e => {
                    if (!this.props.interactive)
                        document.execCommand(this.props.cmd, false, this.props.value)
                    else if (this.props.interactive)
                        this.props.onClick()
                }}
            >{this.props.children}</button>
        )
    }
}
const cmds = [
    {
        cmd: 'undo',
        value: '',
        text: 'undo',
    },
    {
        cmd: 'redo',
        value: '',
        text: 'redo',
    },
    {
        cmd: 'bold',
        value: '',
        text: '粗体',
    },
    {
        cmd: 'italic',
        value: '',
        text: '斜体',
    },
    {
        cmd: 'insertImage',
        value: 'https://pic.36krcnd.com/201905/23025731/ehca51yxmjhrps3t!heading',
        text: '插入图片',
    },
    {
        cmd: 'insertHTML',
        value: '',
        text: '插入html',
        interactive: true,
    },
    {
        cmd: 'fontSize',
        value: '',
        text: '字体大小',
        interactive: true,
    },
    {
        cmd: 'createLink',
        value: '',
        text: '超链接',
        interactive: true,
    }
]
class Toolbar extends React.Component {
    state = {
        modalVisible: false,
        fsmVisible: false,
        lkmVisible: false,
        curRef: '',
    }
    onOk (value) {
        if (Array.isArray(value)) {
            this.refs[this.state.curRef].execCommand(value[0], value[1])
        } else {
            this.refs[this.state.curRef].execCommand(value[0], value[1])
        }
        this.onCancel()
    }
    onCancel () {
        this.setState({
            modalVisible: false,
            fsmVisible: false,
            lkmVisible: false,
       })
    }
    render () {
        // https://w3c.github.io/editing/execCommand.html
        return <div css={css`
            margin: 10px 0;
            display: flex;
        `}>
            {cmds.map(({cmd, value, text, interactive}) => {
                return <CMDButton key={cmd} cmd={cmd} value={value} interactive={interactive} ref={cmd} onClick={() => {
                    const selection = window.getSelection()
                    lastRange = selection.rangeCount > 0 && selection.getRangeAt(0)
                    if (interactive) {
                        this.setState({
                            curRef: cmd,
                        })
                        if (cmd === 'insertHTML') {
                            this.setState({
                                modalVisible: true
                            })
                        }
                        if (cmd === 'fontSize') {
                            this.setState({
                                fsmVisible: true,
                            })
                        }
                        if (cmd === 'createLink') {
                            this.setState({
                                lkmVisible: true,
                            })
                        }
                    }
                }}>{text}</CMDButton>
            })}
            <Modal 
                visible={this.state.modalVisible}
                onOk={value => this.onOk(value)}
                onCancel={_ => this.onCancel()}></Modal>
            <FontSizeModal
                visible={this.state.fsmVisible}
                onOk={value => this.onOk(value)}
                onCancel={_ => this.onCancel()}></FontSizeModal>
            <LinkModal
                visible={this.state.lkmVisible}
                onOk={value => this.onOk(value)}
                onCancel={_ => this.onCancel()}></LinkModal>
        </div>
    }
}
export default Toolbar
export {
    Button
}