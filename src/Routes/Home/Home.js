/**
 * Created by AsTex on 06.12.2016.
 */
import * as React from "react";
import axios from 'axios';
import AppStatus from './AppStatus';
import {observer, inject} from 'mobx-react';
import {Row, Col, Form, Button, Input, Card, notification,Spin} from 'antd';

const FormItem = Form.Item;

@Form.create()
@inject("appState", "routing", "logsStore","config")
@observer
export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionString: '',
            fetching:false
        }
    }
    componentDidMount(){
    }
    stopPipeline() {
        axios.get(this.props.appState.connectionUrl + '/configurator/stopPipeline').then(
            (response) => {
                if (response.data) {
                    let resp = response.data;
                    if (resp.result == true) {
                        notification['success']({
                            message: 'Пайплайн остановлен',
                        });
                    } else {
                        notification['error']({
                            message: 'Ошибка при остановке пайплайна',
                            description: resp.message
                        })
                    }
                }
            }
        ).catch((error) => {
            let e = {...error};
            if (e.response.data) {
                let resp = e.response.data;
                if (resp.result == true) {
                    notification['success']({
                        message: 'Пайплайн остановлен',
                    });
                } else {
                    notification['error']({
                        message: 'Ошибка при остановке пайплайна',
                        description: resp.message
                    })
                }
            }
        })
    }


    setCameraConnectionString(values) {
        this.setState({fetching:true});
        axios.post(this.props.appState.connectionUrl + '/configurator/saveConnectionString', {
            "connection_string": values.connectionString
        }).then((response) => {
            this.setState({fetching:false});
            if (response.data) {
                let resp = response.data;
                if (resp.result) {
                    notification['success']({
                        message: 'Строка подключения установлена'
                    });
                    this.props.config.currentConnectionString = values.connectionString;
                } else {
                    notification['error']({
                        message: 'Ошибка',
                        description: resp.message
                    });
                }
            }
        }).catch((error) => {
            this.setState({fetching:false});
            let e = {...error};
            if (e.response.data) {
                let resp = e.response.data;
                if (resp.result) {
                    notification['success']({
                        message: 'Строка подключения установлена'
                    });
                } else {
                    notification['error']({
                        message: 'Ошибка',
                        description: resp.message
                    });
                }
            }
        })
    }

    startPipeline() {
        axios.get(this.props.appState.connectionUrl + '/configurator/runPipeline').then(
            (response) => {
                if (response.data) {
                    let resp = response.data;
                    if (resp.result == true) {
                        notification['success']({
                            message: 'Запуск пайплайна успешен',
                        });
                    } else {
                        notification['error']({
                            message: 'Ошибка при запуске пайплайна',
                            description: resp.message
                        })
                    }
                }
            }
        ).catch((error) => {
            let e = {...error};
            if (e.response.data) {
                let resp = e.response.data;
                if (resp.result == true) {
                    notification['success']({
                        message: 'Запуск пайплайна успешен',
                    });
                } else {
                    notification['error']({
                        message: 'Ошибка при запуске пайплайна',
                        description: resp.message
                    })
                }
            }
        })
    }

    render() {
        let {getFieldDecorator} = this.props.form;
        return (
            <Spin spinning={this.state.fetching} size="large">

            <div>
                <Row>
                    <Col span={24}>
                        <Form inline onSubmit={(e) => {
                            e.preventDefault();
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    this.setCameraConnectionString(values);
                                }
                            });
                        }}>
                            <Row>
                                <Col span={22}>
                                    {getFieldDecorator('connectionString', {
                                        rules: [{
                                            required: true,
                                            message: 'Пожалуйста, введите строку подключения!',
                                        }],
                                        initialValue:this.props.config.currentConnectionString
                                    })(
                                        <Input className="full_width" placeholder="Введите строку подключения к камере"
                                               size="large"/>
                                    )}
                                </Col>
                                <Col offset={1} span={1}>
                                    <FormItem>
                                        <Button htmlType="submit" shape="circle" icon="rocket" type="primary"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row className="margin_top_40">
                    <Col lg={15} md={15} xs={24} span={15}>
                        <img src={`${this.props.appState.connectionUrl}/configurator/videoFeed`} className="camera" style={{width: 640,border:'1px solid #e9e9e9', height: 480, margin: '0 auto',position:'relative'}}>
                        </img>
                    </Col>
                    <Col lg={{span: 8, offset: 1}} xs={{span: 24, offset: 0}} md={{span: 8, offset: 1}}>
                        <Card title="Статус" className="min_width_150" bordered={true} style={{width: '100%'}}
                              bodyStyle={{padding: 0}}>
                            <AppStatus />
                        </Card>
                    </Col>
                </Row>
                <Row className="margin_top_40">
                    <Col span={15}>
                        <Button className="full_width" type="primary" size="large" onClick={(e) => {
                            this.startPipeline();
                        }}>Запустить пайплайн</Button>
                    </Col>
                    <Col span={8} offset={1}>
                        <Button className="full_width" size="large" onClick={(e) => {
                            this.props.routing.push('/configure');
                        }}>Сконфигурировать</Button>
                    </Col>
                </Row>
                <Row className="margin_top_10">
                    <Col span={15}>
                        <Button className="full_width" type="ghost" size="large" onClick={(e) => {
                            e.preventDefault();
                            this.stopPipeline();
                        }}>Остановить пайплайн</Button>
                    </Col>
                    <Col span={8} offset={1}>
                        <Button className="full_width" type="primary" size="large">Подключиться к логам</Button>
                    </Col>
                </Row>
            </div>
            </Spin>
        )
    }
}
export default Home;