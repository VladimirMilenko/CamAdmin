/**
 * Created by AsTex on 09.12.2016.
 */
import {observable} from "mobx";
import axios from 'axios';
export class ConfigStore {
    @observable config = {
        base_config: {
            latitude: '',
            longitude: '',
            location: '',
            resolution: '',
            interval: ''
        },
        markup_config: {
            lanes: [],
            support_lines: []
        }
    };
    @observable currentConnectionString;
    @observable loading;
    appStore = null;

    constructor(appStore) {
        this.appStore = appStore;
    }
    saveCurrentConfig() {
        return axios.post(this.appStore.connectionUrl + '/config/edit', this.config);
    }
    fetchCurrentConfig() {
        this.loading = true;
        axios.get(this.appStore.connectionUrl + '/config')
            .then((response) => {
                if (response.data) {
                    this.loading = false;
                    delete response.data.last_update;
                    let resp = response.data;
                    if (resp.base_config) {
                        this.config.base_config = resp.base_config;
                    }
                    if (resp.markup_config) {
                        this.config.markup_config = resp.markup_config;
                    }
                }
            })
            .catch((e) => {
                this.loading = false;
            });
        axios.get(this.appStore.connectionUrl+'/configurator/getConnectionString')
            .then((response)=>{
                if(response.data){
                    if(response.data.connection_string)
                        this.currentConnectionString = response.data.connection_string;
                    else
                        this.currentConnectionString = ''

                }
            })
            .catch((e)=>{
                this.currentConnectionString = ''
            })
    }

}

export default ConfigStore;