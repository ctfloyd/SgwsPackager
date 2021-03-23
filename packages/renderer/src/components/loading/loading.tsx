
import React from 'react';
import Loader from 'react-loader-spinner';
import IpcEvents from 'common/ipc-events';
import { State } from '../../index';
import { useHistory } from 'react-router-dom';
import './loading.css';

interface LoadingProps {
    onStatusUpdate: (data: State) => void;
}

const Loading = ( props: LoadingProps ) => {

    const history = useHistory();

    window.api.on(IpcEvents.RESPONSE_FINISHED_DATA_PROCESSING, (data: State) => {
        props.onStatusUpdate(data);
        history.push('/complete');
    });

    return (
        <div id="loading">
            <div id="spinner">
                <Loader 
                    type="TailSpin" 
                    color="rgb(6, 95, 212)" 
                    height = '150'
                    width = '150'
                />
            </div>
            <h1 className='loading-prompt'>Crunching data, hold on tight!</h1>
        </div>
    )
}

export default Loading;