import React from 'react';
import './index.css'
import LeftTabMenu from "./left-tab-menu";

const LeftPanel = ({addBluePrint})=>{
    return (
        <aside className="editor-left-side">
            <LeftTabMenu addBluePrint={addBluePrint}/>
        </aside>
    );
}

export default LeftPanel;