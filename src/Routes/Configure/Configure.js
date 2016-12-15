/**
 * Created by AsTex on 06.12.2016.
 */
import * as React from "react";
import {observer, inject} from 'mobx-react';
import JSONPretty from 'react-json-pretty';
import {Form, Input, Row, Col, Button, notification,} from 'antd';
import axios from 'axios';
import * as mobx from "mobx";

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
@Form.create()
@observer
@inject("appState", "routing", "config")
export class Configure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.config.config.base_config
        }
    }

    setBaseConfig(nConfig) {
        for (let param in nConfig) {
            if(param=='latitude' || param =='longitude'||param == 'interval')
                this.props.config.config.base_config[[param]] = parseInt(nConfig[[param]]);
            this.props.config.config.base_config[[param]] = nConfig[[param]];
        }
        this.props.config.saveCurrentConfig().then(
            (response) => {
                if (response.data) {
                    let resp = response.data;
                    if (resp.success == true) {
                        notification['success']({
                            message: 'Конфигурация обновлена'
                        });
                    } else {
                        notification['error']({
                            message: 'Ошибка при обновлении конфигурации',
                            description: resp.message
                        });
                    }
                }
            }
        ).catch((e) => {
            let error = {...e};
            if (error.response.data) {
                notification['error']({
                    message: 'Ошибка при обновлении конфигурации',
                    description: error.response.data.message
                });
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {config} = this.props.config;
        return (
            <Row>
                <Col span={24}>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        this.props.form.validateFields((err, values) => {
                            if (!err) {
                                this.setBaseConfig(values);
                            }
                        });
                    }}>
                        <FormItem label="Location" {...formItemLayout}>
                            {getFieldDecorator('location', {
                                rules: [{
                                    required: true,
                                }],
                                initialValue: config && config.base_config ? config.base_config.location : ''
                            })(
                                <Input onChange={(e) => this.setState({location: e.target.value})}
                                       placeholder="Введите краткое название места" size="large"/>
                            )}
                        </FormItem>
                        <FormItem label="Latitude" {...formItemLayout}>
                            {getFieldDecorator('latitude', {
                                rules: [{
                                    required: true,
                                }],
                                initialValue: config && config.base_config ? config.base_config.latitude : ''

                            })(
                                <Input onChange={(e) => this.setState({latitude: parseInt(e.target.value)})}
                                       placeholder="Введите широту" size="large"/>
                            )}
                        </FormItem>
                        <FormItem label="Longitude" {...formItemLayout}>
                            {getFieldDecorator('longitude', {
                                rules: [{
                                    required: true,
                                }],
                                initialValue: config && config.base_config ? config.base_config.longitude : ''

                            })(
                                <Input onChange={(e) => this.setState({longitude: parseInt(e.target.value)})}
                                       placeholder="Введите долготу" size="large"/>
                            )}
                        </FormItem>
                        <FormItem label="Resolution" {...formItemLayout}>
                            {getFieldDecorator('resolution', {
                                rules: [{
                                    required: true,
                                }],
                                initialValue: config && config.base_config ? config.base_config.resolution : ''

                            })(
                                <Input onChange={(e) => this.setState({resolution: e.target.value})}
                                       placeholder="Краткое разрешение камеры" size="large"/>
                            )}
                        </FormItem>
                        <FormItem label="Interval" {...formItemLayout}>
                            {getFieldDecorator('interval', {
                                rules: [{
                                    required: true,
                                }],
                                initialValue: config && config.base_config ? config.base_config.interval : ''

                            })(
                                <Input onChange={(e) => this.setState({interval: parseInt(e.target.value)})}
                                       placeholder="Введите интервал" size="large"/>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={11}>
                                <Button size="large" className="full_width" onClick={(e) => {
                                    e.preventDefault();
                                    this.props.routing.push('/');
                                }} type="ghost">На главную</Button>
                            </Col>
                            <Col span={11} offset={2}>
                                <Button size="large" className="full_width" type="primary"
                                        htmlType="submit">Сохранить</Button>
                            </Col>
                        </Row>
                        <Row className="margin_top_10">
                            <Col span={24}>
                                <Button size="large" className="full_width" onClick={(e) => {
                                    e.preventDefault();
                                    this.props.routing.push('/markup');
                                }} type="primary">Перейти к
                                    разметке</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={24} className="margin_top_40">
                    <JSONPretty json={this.state}/>
                </Col>
            </Row>
        )
    }
}

export
default
Configure;