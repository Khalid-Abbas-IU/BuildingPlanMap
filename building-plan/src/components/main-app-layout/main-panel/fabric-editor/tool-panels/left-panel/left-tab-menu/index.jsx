import React from 'react';
import './index.css'

const LeftTabMenu =({addBluePrint})=>{

    return (
        <div className="editor-left-menu">
            <div className={"left-tab-bar"}>
                <div className="fab-icon-button" onClick={addBluePrint}>
                    {/*<img src={'My_Portfolio/images/black/text.png'} height={23} width={23}/>*/}
                    <span>Blue Print</span>
                </div>
                <div className="fab-icon-button">
                    <span>Marker</span>
                </div>
            </div>

        </div>
    );
}

export default LeftTabMenu;