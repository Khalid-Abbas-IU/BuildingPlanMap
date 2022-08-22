import {useEffect, useState} from "react";
import {fabric} from 'fabric';
import '../../../../../fabric-overrids/index'
import './index.css'
import EditorPanels from '../../index'
import ToolBaar from "../../tool-baar";
const {EditorHeader,FabEditorLeft,FabEditorRight}=EditorPanels;
let canvas, isGridCreated=false , markerMode = false;
const FabEditor =()=>{

    const [isMarkerState, setIsMarkerState] = useState(false)

    useEffect(() => {
        document.addEventListener('wheel', function(e) {
            e.ctrlKey && e.preventDefault();
        }, {
            passive: false,
        });
        window.addEventListener('resize', function(e) {
            adjustCanvasDimensions();
        }, true);
        inItCanvas();
    },[]);

    useEffect(() => {
        enableMarkerMode(isMarkerState);
        markerMode = isMarkerState;
    },[isMarkerState]);



    const inItCanvas =()=>{
        canvas = new fabric.Canvas('canvas',{
            width:700,
            height:500,
            backgroundColor:'white',
            hoverCursor: 'grab',
            moveCursor:'grabbing',
            selection: false,
        })
        // const cursorUrl = 'https://ossrs.net/wiki/images/figma-cursor.png';
        canvas.defaultCursor = `grab`;
        canvas.hoverCursor = `grab`;
        canvas.moveCursor = `grab`;
        onCanvasEvents(canvas)
        window.canvas = canvas;
        adjustCanvasDimensions();
        canvas.renderAll();
    }

    function onCanvasEvents(canvas){
        canvas.on({
            'object:added': objectAdded,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'object:moving': objectMoving,
            'object:modified' : modifiedObject,
            'object:scaling':objectScaling,
            'object:scaled':objectScaled,
            'object:rotating':objectRotating,
            'mouse:up':mouseUp,
            // 'mouse:over':mouseOver,
            'mouse:move':mouseOver,
            'mouse:down':mouseDown,
            'after:render':afterRender,
            'key:down':onKeyDown,
            'mouse:wheel':mouseWheel
        })
    }
    function offCanvasEvents(canvas){
        canvas.off({
            'object:added': objectAdded,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'object:moving': objectMoving,
            'object:modified' : modifiedObject,
            'object:scaling':objectScaling,
            'object:scaled':objectScaled,
            'object:rotating':objectRotating,
            'mouse:up':mouseUp,
            'mouse:over':mouseOver,
            'mouse:down':mouseDown,
            'after:render':afterRender,
            'key:down':onKeyDown,
            'mouse:wheel':mouseWheel
        })
    }

    const enableMarkerMode =(isMarkerState)=>{
        const cursor = isMarkerState ? 'crosshair' : 'grab';
        if (isMarkerState) {
            if (canvas.getActiveObject()){
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
        canvas.set({
            defaultCursor : cursor,
            hoverCursor : cursor,
            moveCursor : cursor,
        });
        canvas.renderAll();
        fabric.Object.prototype.set({
            hasControls:!isMarkerState,
            selection:!isMarkerState,
            selectable:!isMarkerState
        })
    }


    const afterRender=()=>{
        draw_grid(25);
    }

    function draw_grid(grid_size) {
        grid_size || (grid_size = 25);
        if(!canvas) return;
        var grid_context = canvas.getContext("2d")

        var currentCanvasWidth = canvas.getWidth();
        var currentCanvasHeight = canvas.getHeight();
        grid_context.strokeWidth  = 1;
        grid_context.strokeStyle = "rgb(206, 206, 217)";



        // Drawing vertical lines
        var x;
        for (x = 0; x <= currentCanvasWidth; x += grid_size) {
            grid_context.moveTo(x + 0.5, 0);
            grid_context.lineTo(x + 0.5, currentCanvasHeight);
        }

        // Drawing horizontal lines
        var y;
        for (y = 0; y <= currentCanvasHeight; y += grid_size) {
            grid_context.moveTo(0, y + 0.5);
            grid_context.lineTo(currentCanvasWidth, y + 0.5);
        }
        grid_context.strokeStyle = "rgb(206, 206, 217)";
        grid_context.stroke();
        isGridCreated = true;
    }
    const adjustCanvasDimensions=()=>{
        let elHeight = 0, elWidth = 0;
        document.querySelectorAll('div').forEach((el)=>{
        if (el.classList.contains('fabric-editor-pro')){
                elWidth = el.clientWidth;
                elHeight = el.clientHeight;
            }
        })
        let width = elWidth,
            height = elHeight;
        canvas.setWidth(width)
        canvas.setHeight(height)
        canvas.renderAll();
    }
    const mouseWheel =(opt)=> {
        var delta = opt.e.deltaY;
        var pointer = opt.pointer;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        setCanvasZoom(zoom,pointer)
        // canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    const setCanvasZoom =(zoom,pointer)=> {
        // const focusObject = canvas.getActiveObject();
        // // const zoom = (value / 100) || 1;
        //
        // if (focusObject) {
        //     canvas.setZoom(zoom);
        //     canvas.absolutePan({
        //         x: (-canvas.getCenter().left + (focusObject.getCenterPoint().x * zoom)),
        //         y: (-canvas.getCenter().top + (focusObject.getCenterPoint().y * zoom)),
        //     });
        // } else {
        //     canvas.zoomToPoint(
        //         new fabric.Point(
        //             pointer.x,
        //             pointer.y
        //         ),
        //         zoom
        //     );
        // }

        canvas.zoomToPoint(
            new fabric.Point(
                pointer.x,
                pointer.y
            ),
            zoom
        );

    }

    const onToggleMarker=()=>{
        setIsMarkerState(!isMarkerState);
        markerMode = !markerMode
    }

    const onKeyDown = (e) => {
    }

    const getPositionOnMark =(x,y,obj)=>{
        if (!obj) return false;
        let marks = obj._objects.filter(o=>o.name === "pin_location");
        for (const mark of marks) {
            const scaledW = mark.getScaledWidth(),
                    scaledH = mark.getScaledHeight(),
                    halfW = scaledW/2,
                    halfH = scaledH/2,
                    markLeft = mark.left,
                    markTop = mark.top;
            return x > markLeft + halfW && x < markLeft + halfW &&
                y > markTop - halfH && y < markTop + halfH;
        }
        // const scaledW = obj.getScaledWidth(),
        //     scaledH = obj.getScaledHeight(),
        //     halfW = scaledW/2,
        //     halfH = scaledH/2,
        //     bpLeft = obj.left,
        //     bpTop = obj.top;
        // return x > bpLeft - halfW && x < bpLeft + halfW &&
        //     y < bpTop + halfH && y > bpTop - halfH;

    }

    const mouseOver=(e)=>{
        // let obj = e.target;
        // if (!obj) return;
        // if (obj.type === "group" && obj.name === "blue_print"){
        //     const {x,y} = e.pointer;
        //     const isOnRange = getPositionOnMark(x,y,obj);
        //     console.log(isOnRange);
        //
        // }
    }
    const mouseUp=(e)=>{
        let obj = e.target;
        if (!obj) return;
        if (obj.name !== "blue_print") return;
        const pointers = e.pointer;
        if (isMarkerState || markerMode){
            setIsMarkerState(!markerMode)
            addMakerPoint(pointers,obj);
        }
    }
    const isOnBluePrint =(x,y,bp)=>{
        x = x * canvas.getZoom()
        y = y * canvas.getZoom()
        if (!bp) return false;
        return new Promise((resolve,reject)=>{
            const scaledW = bp.getScaledWidth(),
                scaledH = bp.getScaledHeight(),
                halfW = scaledW/2,
                halfH = scaledH/2,
                bpLeft = bp.left,
                bpTop = bp.top;
            resolve( x > bpLeft - halfW && x < bpLeft + halfW &&
                y < bpTop + halfH && y > bpTop - halfH);
        })

    }

    const addMakerPoint = async (pointers,bluePrint)=> {
        const uuid = require("uuid");
        let id = uuid.v4();
        const {x, y} = pointers;
        // const isOnRange = await isOnBluePrint(x, y, bluePrint);
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin : "Anonymous",
                ref_id: id,
                left: x,
                top: y,
                originX: 'center',
                originY: 'center',
                name: "pin_location",
                perPixelTargetFind:true
            });
            imgInstance.scaleToWidth(50);
            imgInstance.set('top',y - imgInstance.getScaledHeight()/2);
            // canvas.add(imgInstance);
            canvas.remove(bluePrint)
            let id1 = uuid.v4();
            let numGroup = new fabric.Group([bluePrint,imgInstance], {
                ref_id: id1,
                name: "blue_print",
                originX: 'center',
                originY: 'center',
                // hasControls: false,
                // evented: false,
            });
            canvas.add(numGroup);
            canvas.renderAll();


        };
        img.src = './assets/images/map-location.png';
    }
    const mouseDown=(e)=>{
        // if (!canvas) return;
        // let obj = canvas.getActiveObject();
        // if (obj) return;
        // canvas.setActiveObject(canvas.getObjects()[0])
    }
    const objectAdded=(e)=>{
    }
    const selectionCreated=()=>{
        let obj = canvas.getActiveObject();
        if (!obj) return;
    }
    const selectionUpdated=(e)=>{

    }
    const modifiedObject=(e)=>{

    }
    const objectScaling=(e)=>{

    }
    const objectScaled=(e)=>{

    }
    const objectRotating=(e)=>{

    }
    const objectMoving=(e)=>{

    }
    const addImage = (src) => {
        const uuid = require("uuid");
        let id = uuid.v4();
        let height = canvas.getHeight()/2,
            width = canvas.getWidth()/2;
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin : "Anonymous",
                ref_id: id,
                left: width,
                top: height,
                originX: 'center',
                originY: 'center',
                name: "blue_print",
                perPixelTargetFind:true
            });
            imgInstance.scaleToHeight(canvas.getWidth() * 0.4);
            canvas.renderAll();
            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
        };
        img.src = src;
    };

    const addBluePrint =()=>{
        if (isMarkerState && canvas.getObjects().length) return;
        addImage('./assets/images/blueprints/FLOOR-PLAN-BUILDINGS.jpg')
    }


    const addText=(name)=>{
        let text = new fabric.IText('Hello There',{
            left:200,
            top:400,
            fontSize:20,
            fill:'orange',
            originX:'center',
            originY:'center',
            name
        })
        canvas.add(text);
        canvas.renderAll();
    }
    const addObjectToCanvas =(objectName)=>{
        switch (objectName){
            case 'simple-text':
                addText('simple-text');
                break;
            default:
                addText('simple-text');
                break;
        }
    }
    const deleteActObject =()=>{
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        canvas.remove(actObj)
        canvas.renderAll();
    }
    return (
        <div className="fabric-editor-container">
            <EditorHeader/>
            <div className="editor-main-wrapper">
                <FabEditorLeft addText={addObjectToCanvas} addBluePrint={addBluePrint}/>
                <div className={"canvas-main-wrapper"}>
                    <ToolBaar onToggleMarker={onToggleMarker} markerMode={isMarkerState}/>
                    <div className={`fabric-editor-pro center-content-column`}>
                        <canvas id="canvas" width={1000} height={800}/>
                    </div>
                </div>
                <FabEditorRight deleteActObject={deleteActObject}/>
            </div>
        </div>
    );
}

export default FabEditor;
