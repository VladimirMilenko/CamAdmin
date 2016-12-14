/**
 * Created by AsTex on 06.12.2016.
 */
import * as React from "react";
import JSONPretty from 'react-json-pretty';
import Polyline from '../../UglyComponents/Polyline';
import uuid from 'uuid';
import {observer, inject} from 'mobx-react';
import {findDOMNode} from "react-dom";
import {Row, Col, Radio, notification, Button, Form, Input, Select, InputNumber, Tabs, Tooltip,Spin} from 'antd';
import SupportLineForm from './SupportLineForm'
import LineForm from './LineForm';
import * as mobx from "mobx";
import {Canvas,Circle, Image, Path, Text} from 'react-fabricjs';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

@Form.create()
@Form.create()
@inject("appState", "routing", "config","logsStore")
@observer
export class Markup extends React.Component {
    elem = null;

    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            points: [],
            selectedUUID: '',
            isDrawing: false,
            startX: -1,
            startY: -1,
            drawingType: 'line'
        }
    }

    buildPointsArray(points) {
        let result = "";
        for (let point of points) {
            result += point.x + ',' + point.y + ' ';
        }
        return result;
    }

    saveMarkup() {
        this.props.config.saveCurrentConfig()
            .then(
                (response) => {
                    if (response.data) {
                        let resp = response.data;
                        if (resp.success == true) {
                            notification['success']({
                                message: 'Разметка обновлена'
                            });
                        } else {
                            notification['error']({
                                message: 'Ошибка при обновлении разметки',
                                description: resp.message
                            });
                        }
                    }
                }
            ).catch((e) => {
            let error = {...e};
            if (error.response.data) {
                notification['error']({
                    message: 'Ошибка при обновлении разметки',
                    description: error.response.data.message
                });
            }
        })
    }

    getXY(evt) {
        let element = this.elem;
        let rect = element.getBoundingClientRect();
        let scrollTop = document.documentElement.scrollTop ?
            document.documentElement.scrollTop : document.body.scrollTop;
        let scrollLeft = document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft : document.body.scrollLeft;
        let elementLeft = rect.left + scrollLeft;
        let elementTop = rect.top + scrollTop;
        let x = -1;
        let y = -1;

        if (document.all) {
            x = event.clientX + scrollLeft - elementLeft;
            y = event.clientY + scrollTop - elementTop;
        }
        else {
            x = evt.pageX - elementLeft;
            y = evt.pageY - elementTop;
        }
        return {
            x: x,
            y: y
        }
    }

    handleSVGClick(e) {
        this.props.form.setFieldsValue({selectedLine: ''});
        let {x, y} = this.getXY(e);
        if (!this.state.isDrawing) {
            this.setState({isDrawing: true});

        }
        if (this.state.points.length == 1 && this.state.drawingType == 'line') {
            let prevPoint = this.state.points[0];
            let d = Math.abs(x - prevPoint.x) + Math.abs(y - prevPoint.y);
            if (d < 10) {
                notification['warning']({
                    message: 'Слишком короткая линия',
                    duration: 1
                });
                return;
            }
            console.log(d);
            let line = {
                uuid: uuid.v4(),
                points: [...this.state.points, {x, y}]
            };
            this.state.lines.push(line);
            this.setState({points: []});
        }
        if (this.state.points.length == 0) {
            this.state.points.push({x, y});
        }

        this.forceUpdate();
    }

    saveSupportLine(values) {
        let support_line = {
            uuid: values.selectedLine,
            line_name: values.supportLineName,
            pixels: this.state.lines.find(line => line.uuid == values.selectedLine).points
        };
        console.log(support_line);
        this.props.config.config.markup_config.support_lanes.push(support_line);
        this.state.lines.splice(this.state.lines.findIndex(line => line.uuid == values.selectedLine), 1);
        this.setState({lines: this.state.lines});
        this.forceUpdate();

    }

    saveLane(values) {
        console.log('saveLane');
        let line = {
            direction: values.lineDirection,
            number: values.lineNumber,
            counting_line_name: values.countingLineName
        };
        this.props.config.config.markup_config.lanes.push(line);
    }

    removeLine() {
        let {support_lanes, lanes} = this.props.config.config.markup_config;
        if (this.state.selectedUUID != '') {
            let index = this.state.lines.findIndex(line => line.uuid == this.state.selectedUUID);
            if (index > -1) {
                this.state.lines.splice(index, 1);
                this.setState({selectedUUID: ''});
                this.forceUpdate();
            } else {
                index = support_lanes.findIndex(line => line.uuid == this.state.selectedUUID);
                if (index > -1) {
                    let line = support_lanes[index];
                    let indexes = lanes.findIndex(lane => lane.counting_line_name == line.line_name);
                    while (indexes > -1) {
                        lanes.splice(indexes, 1);
                        indexes = lanes.findIndex(lane => lane.counting_line_name == line.line_name);
                    }
                    support_lanes.splice(index, 1);
                    this.setState({selectedUUID: ''});
                }
            }
        } else {
            notification['error']({
                message: 'Выберите линию',
                duration: 1
            });
        }
    }

    render() {
        let showJSON = mobx.toJS(this.props.config.config.markup_config);
        for (let line of showJSON.support_lanes) {
            delete line.uuid;
        }
        console.log(showJSON);
        let {support_lanes} = this.props.config.config.markup_config;
        return (
            <Row>
                <Col lg={{span: 16}} md={{span: 16}} xs={{span: 20}}>
                    <div style={{width: 640, height: 480, background:this.props.logsStore.cameraState.status ?`url(${this.props.appState.connectionUrl}/configurator/videoFeed)`:'#e9e9e9', margin: '0 auto',position:'relative'}}>
                        <Spin tip="загрузка" spinning={this.props.config.loading}>
                            <svg style={{width: '100%', height: 480,  }} onClick={(e) => this.handleSVGClick(e)}
                                 ref={(elem) => this.elem = elem}>
                                {this.state.lines.map((line) => {
                                    return (
                                        <Tooltip key={line.uuid} placement="top"
                                                 title={`(x1:${Math.ceil(line.points[0].x)},y1:${Math.ceil(line.points[0].y)} ; x2:${Math.ceil(line.points[1].x)},y2:${Math.ceil(line.points[1].y)})`}>
                                        <g >

                                                <polyline onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.setState({
                                                        selectedUUID: line.uuid,
                                                        points: []
                                                    });
                                                    this.props.form.setFieldsValue({selectedLine: line.uuid});
                                                }} points={this.buildPointsArray(line.points)}
                                                          strokeWidth='7'
                                                          stroke={this.state.selectedUUID == line.uuid ? '#803280' : '#FF32FF'}/>
                                                <polyline onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.setState({
                                                        selectedUUID: line.uuid,
                                                        points: []
                                                    });
                                                    this.props.form.setFieldsValue({selectedLine: line.uuid});
                                                }} points={this.buildPointsArray(line.points)}
                                                          strokeWidth='3'
                                                          stroke='#FF32FF'/>
                                        </g>
                                        </Tooltip>

                                    )
                                })}
                                {support_lanes.map((line, index) => {
                                        return (
                                            <g key={index}>
                                                <Tooltip placement="top"
                                                         title={`(x1:${Math.ceil(line.pixels[0].x)},y1:${Math.ceil(line.pixels[0].y)} ; x2:${Math.ceil(line.pixels[1].x)},y2:${Math.ceil(line.pixels[1].y)})`}>
                                                    <polyline id={`support${index}`} onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.setState({
                                                            selectedUUID: line.uuid,
                                                            points: []
                                                        });
                                                        this.props.form.setFieldsValue({selectedLine: line.uuid});

                                                    }} points={this.buildPointsArray(line.pixels)}
                                                              fill='rgb(249,249,249)'
                                                              strokeWidth='5'
                                                              stroke={this.state.selectedUUID == line.uuid ? '#18FFFF' : '#76FF03'}/>
                                                </Tooltip>
                                            </g>
                                        )
                                    }
                                )}
                                {this.state.points.map((point, index) => {
                                    return (
                                        <g key={'point' + '-' + index}>
                                            <circle cx={point.x} cy={point.y} r={3} fill='none' stroke="blue"/>
                                        </g>
                                    )
                                })}
                            </svg>
                        </Spin>
                        <Button
                            className="remove_line_btn"
                            style={{position:'absolute'}}
                            icon="delete"
                            size="large"
                            type="primary"
                            shape="circle"
                            onClick={(e) => {
                                this.removeLine();
                            }}/>
                    </div>

                </Col>
                <Col
                    lg={{span: 1, offset: 1}}
                    md={{span: 1, offset: 1}}
                    xs={{span: 1, offset: 1}}>

                </Col >
                <Col
                    lg={{span: 6}}
                    md={{span: 6}}
                    xs={{span: 24}}>
                    <Tabs
                        defaultActiveKey="1">
                        <TabPane tab="Подсчет" key="1">
                            <SupportLineForm selectedUUID={this.state.selectedUUID}
                                             saveSupportLine={(values) => this.saveSupportLine(values)}/>
                        </TabPane>
                        <TabPane
                            tab="Разметка"
                            key="2">
                            <LineForm saveLane={(values) => this.saveLane(values)}/>
                        </TabPane>

                    </Tabs>
                </Col>
                <Col className="margin_top_10" span={24}>
                    <Button className="full_width" type="primary" onClick={(e) => {
                        this.saveMarkup();
                    }}>Сохранить разметку</Button>
                </Col>
                <Col className="margin_top_10" span={24}>
                    <Button className="full_width" type="ghost" onClick={(e) => {
                        e.preventDefault();
                        this.props.routing.push('/');
                    }}>На главную</Button>
                </Col>
                <Col span={24}>
                    <Row className="margin_top_40">
                        <Col span={24}>
                            <JSONPretty json={showJSON}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default Markup;