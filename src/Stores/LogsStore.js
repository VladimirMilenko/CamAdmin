/**
 * Created by AsTex on 06.12.2016.
 */
import {observable, reaction} from 'mobx';
import * as axios from "axios";
import moment from "moment";

moment.locale('ru');

class LogsStore {

    @observable cameraState = {
        text: 'Камера',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'false': {
                status: 'error',
                message: 'Нет соединения'
            },
            'true': {
                status: 'success',
                message: 'Подключено'
            }
        }
    };
    @observable databaseState = {
        text: 'База данных',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'false': {
                status: 'error',
                message: 'Нет соединения'
            },
            'true': {
                status: 'success',
                message: 'Подключено'
            }
        }
    };
    @observable networkState = {
        text: 'Состояние сети',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'false': {
                status: 'error',
                message: 'Нет соединения'
            },
            'true': {
                status: 'success',
                message: 'Подключено'
            }
        }
    };
    @observable baseConfigState = {
        text: 'Базовая конфигурация',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'false': {
                status: 'error',
                message: 'Не задана'
            },
            'true': {
                status: 'success',
                message: 'Задана'
            }
        }
    };
    @observable markupConfigState = {
        text: 'Конфигурация разметки',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'false': {
                status: 'error',
                message: 'Не задана'
            },
            'true': {
                status: 'success',
                message: 'Задана'
            }
        }
    };
    @observable pipelineState = {
        text: 'Состояние пайплайна',
        status: null,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'stopped': {
                status: 'default',
                message: 'Остановлен'
            },
            'failed': {
                status: 'error',
                message: 'Ошибка'
            },
            'working': {
                status: 'success',
                message: 'Работает'
            },
            'starting': {
                status: 'processing',
                message: 'Запускается'
            }
        }
    };
    @observable uptimeStatus = {
        text: 'Аптайм',
        status: null,
        statusIsValue: true,
        renderable:true,
        render:(value)=>{
            let duration = moment.duration(value,'seconds');
            return `${duration.asHours()}:${duration.minutes()}:${duration.seconds()}`
        },
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };
    @observable carCounterStatus = {
        text: 'Количество машин',
        status: null,
        statusIsValue: true,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };
    @observable cpuStatus = {
        text: 'CPU Usage',
        status: null,
        statusIsValue: true,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };
    @observable ramStatus = {
        text: 'RAM Usage',
        status: null,
        statusIsValue: true,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };
    @observable fpsStatus = {
        text: 'FPS',
        status: null,
        statusIsValue: true,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };
    @observable temperatureStatus = {
        text: 'Температура',
        status: null,
        statusIsValue: true,
        statusDescription: {
            'null': {
                status: 'warning',
                message: 'Недоступно',
            },
            'default': {
                status: 'success',
                message: ''
            }
        }
    };

    appStore = null;
    intervalObject = null;
    url = "";
    statusList = [
        'cameraState', 'databaseState', 'networkState', 'baseConfigState', 'markupConfigState', 'pipelineState', 'uptimeStatus', 'carCounterStatus', 'cpuStatus', 'ramStatus', 'fpsStatus', 'temperatureStatus'
    ];

    constructor(appStore) {
        this.appStore = appStore;
        this.urlUpdateHandler = reaction(()=>this.appStore.connectionUrl, (url) => {
            if (url != null)
                this.start(url);
        })
    }

    start(url, interval = 5000) {
        let statusUrl = url + '/configurator/status';
        this.fetchStateFromUrl(statusUrl);
        if (this.interval != null) {
            clearInterval(interval);
        }
        this.intervalObject = setInterval(() => {
            this.fetchStateFromUrl(statusUrl);
        }, interval);
    }

    fetchStateFromUrl(url) {
        axios.get(url).then((response) => {
            if (response.data) {
                let json = response.data;
                this.fromJSON(json);
            }
        })
    }

    fromJSON(json) {
        if (json.camera != 'undefined') {
            this.cameraState.status = json.camera;
        }
        if (json.db != 'undefined') {
            this.databaseState.status = json.db;
        }
        if (json.network != 'undefined') {
            this.networkState.status = json.network;
        }
        if (json.base_config != 'undefined') {
            this.baseConfigState.status = json.base_config;
        }
        if (json.markup_config != 'undefined') {
            this.markupConfigState.status = json.markup_config;
        }
        if (json.pipeline_status != 'undefined') {
            this.pipelineState.status = json.pipeline_status;
        }
        if (json.uptime != 'undefined') {
            this.uptimeStatus.status = json.uptime;
        }
        if (json.counted != 'undefined') {
            this.carCounterStatus.status = json.counted;
        }
        if (json.cpu != 'undefined') {
            this.cpuStatus.status = json.cpu;
        }
        if (json.ram != 'undefined') {
            this.ramStatus.status = json.ram;
        }
        if (json.fps != 'undefined') {
            this.fpsStatus.status = json.fps;
        }
        if (json.temperature != 'undefined') {
            this.temperatureStatus.status = json.temperature;
        }
    }
}

export default LogsStore;