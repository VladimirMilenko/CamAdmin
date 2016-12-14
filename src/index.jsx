import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import AppState from './AppState';
import App from './App';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import {Router, Route, browserHistory, hashHistory} from 'react-router';
import {Home} from "./Routes/Home/Home";
import LogsStore from "./Stores/LogsStore";
import Configure from "./Routes/Configure/Configure";
import Markup from "./Routes/Markup/Markup";
import ConfigStore from "./Stores/ConfigStore";

const routingStore = new RouterStore();
const appState = new AppState();
const logsStore = new LogsStore(appState);
const configStore = new ConfigStore(appState);
appState.setDefaultConnectionUrl();
configStore.fetchCurrentConfig();

const stores = {
    routing: routingStore,
    appState: appState,
    logsStore: logsStore,
    config:configStore
};

const history = syncHistoryWithStore(hashHistory, routingStore);

render(
    <Provider {...stores}>
        <Router history={history}>
            <Route path="/" component={Home}/>
            <Route path="/configure" component={Configure}/>
            <Route path="/markup" component={Markup}/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./Routes/Home/Home', () => {
        const NextApp = require('./Routes/Home/Home').default;
        const NextCfg = require('./Routes/Configure/Configure').default;

        render(
            <Provider {...stores}>
                <Router history={history}>
                    <Route path="/" component={NextApp}/>
                    <Route path="/configure" component={NextCfg}/>
                    <Route path="/markup" component={Markup}/>
                </Router>
            </Provider>,

            document.getElementById('root')
        );
    });
}
