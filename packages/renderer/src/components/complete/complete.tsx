
import React from 'react';
import DataProcessStatus from 'common/data-process-status';
import { State } from '../../index';
import './complete.css';

interface CompleteProps  {
    getState: () => State;
}

const Complete = (props: CompleteProps) => {
    
    const state = props.getState();
    if(state.error) console.log(state.error);

    return (
        <div id="complete">
            <div id="text-container">
                { state.status == DataProcessStatus.Ok ? 
                        <h1 className='text'>Processing complete. Please close this window.</h1>     :
                        <h1 className='text fail'>Oops! Something went wrong. Please ensure that the input data is compatible with this process. Close this window and try again.</h1>
                }
            </div>
        </div>
    )
}
export default Complete;