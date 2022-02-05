import { commafy } from '../../utilities/utilities';

const Bar = ({ x, y, width, height, planetName }) => (
    <>
        <g className="container">
            <rect x={x} y={y} width={width} height={height} fill={`lightGray`} className='bar-group' style={{ strokeWidth: "4", stroke: "black" }} />
            <text x={x + width / 3 - 70} y={y - 100} className='light'>
                {commafy(height * 2500000)}
            </text>
            <text x={x + width / 3 - (planetName.length / 3) * 20} y={2400} style={{ letterSpacing: 7 }}>
                {planetName}
            </text>
        </g>
    </>
)

export default Bar;