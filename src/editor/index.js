import React from "react";

class Editor extends React.Component {
    render () {
        return <div id={this.props.id} css={`height: 100vh; width: 100wh;`} 
        onInput={(e) => {
            console.log(e.currentTarget)
        }}
        onKeyDown={(e) => {
            // console.log(e.keyCode)
            if (e.keyCode == 13) {
                e.preventDefault()
                const p = document.createElement('p')
                document.execCommand('insertHtml', false, '<p><br></p>')
                const selection = document.getSelection()
                // selection.removeAllRanges();
                console.log(selection.rangeCount, selection.getRangeAt(0))
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
            const html = e.clipboardData.getData('text/html')
            e.preventDefault()
            console.log(html)
        }}
        onMouseUp={(e) => {
            const selection = document.getSelection()
            console.log(selection)
        }}
        contentEditable={true} spellCheck={false}>
            <p>
                <br></br>
            </p>
        </div>
    }
}


export default Editor