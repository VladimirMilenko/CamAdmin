/**
 * Created by AsTex on 06.12.2016.
 */
import * as React from "react";
import {observer, inject} from 'mobx-react';
import {Badge, Row, Col, Card} from 'antd';

@inject("logsStore")
@observer
export class AppStatus extends React.Component {
    renderProp(property){
        console.log(property.text + " " + property.status);
        if(property.renderable && property.statusIsValue){
            if(property.status == null){
                return (
                    <Row key={'prop'+property.text} className="border_bottom padding_15">
                        <div style={{float: 'left'}}>
                            <span>{property.text}</span>
                        </div>
                        <div style={{float: 'right',minWidth:'130px'}}>
                            <Badge status={property.statusDescription[['null']].status} text={property.statusDescription[['null']].message}/>
                        </div>
                    </Row>
                )
            } else{
                return (
                    <Row key={'prop'+property.text}  className="border_bottom padding_15">
                        <div style={{float: 'left'}}>
                            <span>{property.text}</span>
                        </div>
                        <div style={{float: 'right',minWidth:'130px'}}>
                            <Badge status={property.statusDescription[['default']].status} text={property.render(property.status)}/>
                        </div>
                    </Row>
                )
            }
        }
        if(property.statusIsValue){
            if(property.status == null){
                return (
                    <Row key={'prop'+property.text} className="border_bottom padding_15">
                        <div style={{float: 'left'}}>
                            <span>{property.text}</span>
                        </div>
                        <div style={{float: 'right',minWidth:'130px'}}>
                            <Badge status={property.statusDescription[['null']].status} text={property.statusDescription[['null']].message}/>
                        </div>
                    </Row>
                )
            } else{
                return (
                    <Row key={'prop'+property.text}  className="border_bottom padding_15">
                        <div style={{float: 'left'}}>
                            <span>{property.text}</span>
                        </div>
                        <div style={{float: 'right',minWidth:'130px'}}>
                            <Badge status={property.statusDescription[['default']].status} text={property.status}/>
                        </div>
                    </Row>
                )
            }
        }
        let status = property.statusDescription[[property.status + '']].status;
        return (
            <Row key={'prop'+property.text}  className="border_bottom padding_15">
                <div style={{float: 'left'}}>
                    <span>{property.text}</span>
                </div>
                <div style={{float: 'right',minWidth:'130px'}}>
                    <Badge status={status} text={property.statusDescription[[property.status + '']].message}/>
                </div>
            </Row>
        )
    }
    render() {
        let {logsStore} = this.props;
        return (
            <Row className="min_width_150">
                <Col span={24}>
                    {logsStore.statusList.map((status)=>{
                        return(
                            this.renderProp(logsStore[[status]])
                        )
                    })}
                </Col>
            </Row>
        )
    }
}
export default AppStatus;