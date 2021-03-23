import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';
import DataProcessStatus from 'common/data-process-status';

import Landing from './components/landing/landing';
import Loading from './components/loading/loading';
import Complete from './components/complete/complete';

export interface State {
    status: DataProcessStatus,
    error?: Error
}

let state: State = { 
    status: DataProcessStatus.Error,
    error: new Error('Default unitialized state')
};

const handleStatusUpdate = (result: State) => {
    state = result;
    console.log(state);
}

const getState = (): State => {
    return state;
}

ReactDOM.render(
    <Router>
        <Switch>
            <Route path = "/loading">
                <Loading onStatusUpdate={handleStatusUpdate}/>
            </Route>
            <Route path ="/complete">
                <Complete getState={getState}/>
            </Route>
            <Route path = "/">
                <Landing/>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('app')
)

