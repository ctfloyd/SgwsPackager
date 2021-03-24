import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './drag-and-drop.css';
import IpcEvents from 'common/ipc-events';


const dragAndDrop = () => {

    const history = useHistory();

    const [filePath, setFilePath] = useState('');
    const [dragCounter, setDragCounter] = useState(0);

    const arrowBase = useRef<HTMLSpanElement>(null);
    const arrowTip = useRef<HTMLSpanElement>(null);
    const prompt = useRef<HTMLParagraphElement>(null);
    const firstUpdate = useRef(true);

    const handleDrop = (event: any) => {
        if (!event || !event.dataTransfer || !event.dataTransfer.files) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        let file;
        if (file = event.dataTransfer.files.item(0)) {
            setFilePath(file.path);
        }

        setDragCounter(0);
        arrowBase.current?.setAttribute('state', 'out');
        arrowTip.current?.setAttribute('state', 'out');
    }

    const handleDragOver = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDragEnter = () => {
        setDragCounter(dragCounter + 1);
    }

    const handleDragLeave = () => {
        setDragCounter(dragCounter - 1)
    }
 
    const handleSelectFiles = () => {
        window.api.send(IpcEvents.REQUEST_SHOW_OPEN_DIALOG);
    }

    const handleContinue = () => {
        window.api.send(IpcEvents.REQUEST_START_DATA_PROCESSING, filePath);
        history.push('/loading');
    }

    window.api.on(IpcEvents.RESPONSE_SHOW_OPEN_DIALOG, (data: any) => {
        if(data && data.filePaths && data.filepaths.length && data.filepaths.length > 0) {
            setFilePath(data.filePaths[0]);
        }
    });

    window.api.on(IpcEvents.RESPONSE_PATH_BASENAME, (filePath: string) => {
        console.log('responded');
        if(!prompt.current)
            return;

        // TODO: Just get the basename by delegating call to main loop.
        prompt.current.innerText = 'Selected file: ' + filePath;

        const warningChild = document.createElement('p');
        warningChild.innerText = 'Warning: Continuing will overwrite the file!';
        warningChild.classList.add('warning');
        prompt.current.appendChild(warningChild);
    });

    useEffect(() => {
        if(dragCounter == 0) {
            arrowTip.current?.setAttribute('state', 'out');
            arrowBase.current?.setAttribute('state', 'out');
        } else {
            arrowTip.current?.setAttribute('state', 'in');
            arrowBase.current?.setAttribute('state', 'in');
        }
    }, [dragCounter])

    useEffect(() => {  

        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        window.api.send(IpcEvents.REQUEST_PATH_BASENAME, filePath);

    }, [filePath, firstUpdate])


    return (
        <div id="drag-and-drop-widget" 
            onDrop={handleDrop} 
            onDragOver={handleDragOver} 
            onDragEnter={handleDragEnter} 
            onDragLeave={handleDragLeave}
        >
            <span id="circle" onClick={handleSelectFiles}>
                <span id="arrow">
                    <span id="triangle" className='arrow-animation move-vertically-animation' ref={arrowTip}></span>
                    <span id="rectangle" className='arrow-animation shrink-and-squash-animation' ref={arrowBase}></span>
                    <span id="arrow-underline"></span>
                </span>

            </span>
            <p id="dnd-prompt" className='text' ref={prompt}>Drag and drop files to continue</p>
            { filePath.length <= 0 ? <div className='button text' onClick={handleSelectFiles}>SELECT FILES</div> :
                         <div className='button text' onClick={handleContinue}>CONTINUE</div>
            }
        </div>
    )

}


export default dragAndDrop;
