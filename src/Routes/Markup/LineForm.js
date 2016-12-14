/**
 * Created by AsTex on 10.12.2016.
 */
import {Form, Input, InputNumber, Button,Select} from 'antd';
import * as React from "react";
import {observer,inject} from 'mobx-react';
const FormItem = Form.Item;

@observer
@inject("config")
@Form.create()
export default class LineForm extends React.Component {
    render() {
        let {getFieldDecorator} = this.props.form;
        let {support_lanes} = this.props.config.config.markup_config;
        return (
            <Form
                horizontal
                onSubmit={(e) => {
                    e.preventDefault();
                    this.props.form.validateFields((err, values) => {
                        console.log(err);
                        if (!err) {
                            this.props.saveLane(values);
                        }
                    });
                }}>
                <FormItem
                    label="Направление">
                    {getFieldDecorator('lineDirection', {
                        rules: [{
                            required: true,
                        }],
                    })
                    (<Select placeholder="Выберите направление линии" size="large">
                        <Select.Option value="forward">Вперед</Select.Option>
                        <Select.Option value="backward">Назад</Select.Option>
                    </Select>)}
                </FormItem>
                <FormItem className="full_width" label="Номер линии">
                    {getFieldDecorator('lineNumber', {
                        rules: [{
                            required: true,
                        }],
                        initialValue: 0
                    })(
                        <InputNumber size="large"/>
                    )}
                </FormItem>
                <FormItem label="Выберите линию подсчета">
                    {getFieldDecorator('countingLineName', {
                        rules: [{
                            required: true,
                        }],
                    })(
                        <Select placeholder="Линия подсчета" size="large">
                            {
                                support_lanes.map((line, index) => {
                                    return (
                                        <Select.Option key={index}
                                                       value={line.line_name}>{line.line_name}</Select.Option>
                                    );
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <Button className="full_width" type="primary" htmlType="submit">Добавить линию разметки</Button>
            </Form>
        )
    }
}