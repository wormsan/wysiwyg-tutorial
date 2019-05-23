import React from "react";
import styled, {css} from 'styled-components'
import parse5 from 'parse5'

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
class Editor extends React.Component {
    render () {
        return <div id={this.props.id} css={css`
        height: 100vh; 
        width: 100%;
        border: 1px solid #007bff;
        `} 
        onInput={(e) => {
            console.log(e.currentTarget)
        }}
        onKeyDown={(e) => {
            // console.log(e.keyCode)
            if (e.keyCode == 13) {
                // e.preventDefault()
                // const p = document.createElement('p')
                // document.execCommand('insertHtml', false, '<p><br></p>')
                // const selection = document.getSelection()
                // // selection.removeAllRanges();
                // console.log(selection.rangeCount, selection.getRangeAt(0))
                // const range = new Range()
                // selection.addRange(range);
            }
        }}
        onKeyUp={(e) => {
            // console.log(e.keyCode)
            // e.preventDefault()
        }}
        // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData
        // https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-getdata
        onPaste={(e) => {
            if (this.props.copyWithStyle) return
            e.preventDefault()
            const html = e.clipboardData.getData('text/html')
            let content = unescape(html).replace(/^(\s|\S)*<!--StartFragment-->/, '').replace(/<!--EndFragment-->(\s|\S)*$/, '')
            const documentFragment = parse5.parse(content)
            function rec (node) {
                if (node.childNodes) {
                    node.childNodes = node.childNodes.filter(n => {
                        if (n.tagName !== 'style' && n.tagName !== 'link' ) {
                            return true
                        }
                    })
                    node.childNodes.forEach(n => {
                        if (n.attrs) {
                            n.attrs = []
                        }
                    })
                    node.childNodes.forEach(n => rec(n))
                }
            }
            rec(documentFragment)
            content = parse5.serialize(documentFragment)
            const editor = document.querySelector('#editor')
            const lastNode = editor.childNodes[editor.childNodes.length - 1]
            const ne = document.createElement('p')
            ne.appendChild(document.createElement('br'))
            ne.innerHTML = content
            insertAfter(ne, lastNode)
            const selection = document.getSelection()
            const r = document.createRange()
            // r.setStartBefore(ne)
            r.setStartAfter(ne)
            r.setEndAfter(ne)
            selection.rangeCount > 0 && selection.removeAllRanges()
            selection.addRange(r)
        }}
        contentEditable={this.props.editable} spellCheck={false}>
            <p>
                <br></br>
            </p>
        </div>
    }
}


export default Editor