import {observable, computed, action} from 'mobx';

class AppState {
    @observable defaultConnectionUrl = "";

    constructor() {
    }
    @action
    setDefaultConnectionUrl() {
        this.defaultConnectionUrl = "http://localhost:5000/";
    }

    @computed get connectionUrl() {
        if (this.defaultConnectionUrl != '' && this.defaultConnectionUrl != null) {
            if (this.defaultConnectionUrl[this.defaultConnectionUrl.length - 1] == '/')
                return this.defaultConnectionUrl.substring(0, this.defaultConnectionUrl.length - 1);
            return this.defaultConnectionUrl;
        }
        else {
            return null;
        }
    }
}

export default AppState;
