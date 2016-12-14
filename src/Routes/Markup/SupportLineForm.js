/**
 * Created by AsTex on 10.12.2016.
 */
import {Form, Input, InputNumber,Button,notification} from 'antd';
import * as React from "react";

const FormItem = Form.Item;

@Form.create()
export default class SupportLineForm extends React.Component {
    componentWillReceiveProps(nextProps){
        if(this.props.selectedUUID!=nextProps.selectedUUID)
            this.props.form.setFieldsValue(
                {
                    selectedLine:nextProps.selectedUUID
                }
            );
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        return (
            <Form horizontal onSubmit={(e) => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    if(this.props.selectedUUID == ''){
                        notification['error']({
                            message:'Выберите линию'
                        });
                    }
                    if (!err) {
                        this.props.saveSupportLine({...values,selectedLine:this.props.selectedUUID});
                    }
                });
            }}>
                <FormItem label="Название">
                    {getFieldDecorator('supportLineName', {
                        rules: [{
                            required: true,
                        }],
                    })(
                        <Input placeholder="Введите название линии" size="large"/>
                    )}
                </FormItem>
                <FormItem className="full_width" label="Номер линии">
                    {getFieldDecorator('supportLineNumber', {
                        rules: [{
                            required: true,
                        }],
                        initialValue: 0
                    })(
                        <InputNumber size="large"/>
                    )}
                </FormItem>
                <Button className="full_width" type="primary"
                        htmlType="submit">Добавить линию подсчета</Button>
            </Form>
        )
    }
}