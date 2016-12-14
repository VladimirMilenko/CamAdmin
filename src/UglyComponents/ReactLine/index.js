/**
 * Created by netre on 13.10.2016.
 */
import React from 'react';

class Line extends React.Component {

    static propTypes = {
        from: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired,
        }),
        to: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired,
        }),
        style: React.PropTypes.string,
        zIndex: React.PropTypes.number,
        onClickHandler: React.PropTypes.func,
        active: React.PropTypes.bool
    };

    render() {
        let result = [];
        let isFirst = this.props.isFirst;
        let isLast = this.props.isLast;
        let from = this.props.from;
        let to = this.props.to;
        if (to.x < from.x) {
            from = this.props.to;
            to = this.props.from;
        }

        const len = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
        const angle = Math.atan((to.y - from.y) / (to.x - from.x));

        const style = {
            position: 'absolute',
            transform: `translate(${from.x - .5 * len * (1 - Math.cos(angle))}px, ${from.y + .5 * len * Math.sin(angle) - 5 }px) rotate(${angle}rad)`,
            width: `${len}px`,
            height: `${0}px`,
            borderBottom: this.props.style || '5px solid #384a6c',
            zIndex: this.props.zIndex ? this.props.zIndex : 1
        };

        return (
            <div itemType="connection" style={{
                position: 'absolute',
                transform: style.transform,
                width: style.width,
                height: '10px',
                lineHeight: '5px',
                textAlign: 'center',
                zIndex: style.zIndex
            }} className="connection" onClick={this.props.onClickHandler}>
                <div itemType="connection" className="connection" style={{
                    width: `${len}px`,
                    height: `${0}px`,
                    borderBottom: this.props.style || '5px solid #384a6c', position: 'relative'
                }} onClick={this.props.onClickHandler}>
                </div>
            </div>

        );
    }
}
export default Line;
