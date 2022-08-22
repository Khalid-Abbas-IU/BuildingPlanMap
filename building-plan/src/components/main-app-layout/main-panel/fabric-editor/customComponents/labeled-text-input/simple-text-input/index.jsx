import React from 'react';
import './index.css'

const SimpleTextInput =({inputValue,handleTextChanged,customClass})=>{
    return (
        <div className={`text-input center-content ${customClass}`}>
            <input type="text" className="simple__input" defaultValue="Input Text" onChange={handleTextChanged} value={inputValue}/>
        </div>
    );
}

export default SimpleTextInput;