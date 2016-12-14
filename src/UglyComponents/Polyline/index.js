/**
 * Created by netre on 13.10.2016.
 */
import React from 'react';
import ReactLine from '../ReactLine';

const getLink = (p1, p2) => ({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y});
const createPairs = (items, pairify) => items.reduce(
    (acc, item, index, arr) =>
        !arr[index + 1] ? acc
            : acc.concat(pairify(item, arr[index + 1]))
    , []);

class Polyline extends React.Component {
    static propTypes = {
        coordinates: React.PropTypes.arrayOf(React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        })),
        style: React.PropTypes.string,
        closed: React.PropTypes.bool,
        id: React.PropTypes.string,
        selected: React.PropTypes.bool,
        connectionSelected:React.PropTypes.func
    };

    render() {
        let coords = this.props.coordinates;

        // add a coordinate to close the polyline if wanted
        if (this.props.closed) {
            coords = coords.concat(coords[0]);
        }
        const pairs = createPairs(coords, getLink);

        return (
            <div itemType="connection" style={{position: 'absolute', top: '0', left: '0'}}>
                {
                    pairs.map((p, i) =>
                        <ReactLine
                            active={this.props.selected}
                            onClickHandler={(e)=>{this.props.connectionSelected()}}
                            isFirst={i == 0}
                            isLast={i == pairs.length - 1}
                            key={i}
                            from={{x: p.x1, y: p.y1}}
                            to={{x: p.x2, y: p.y2}}
                            style={!this.props.selected ? this.props.style : "5px solid green"}
                            zIndex={this.props.selected ? 1000 : 1}
                        />
                    )
                }
            </div>
        );
    }

}
export default Polyline;
