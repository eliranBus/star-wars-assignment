const ChartSvg = ({ children, width, height }) => (
    <svg
        viewBox={`0 0 ${width} ${height + 450}`}
        width="70%"
        height="70%"
        preserveAspectRatio="xMidYMax meet"
    >
        {children}
    </svg>
);

export default ChartSvg;