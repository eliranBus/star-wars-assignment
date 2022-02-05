import React from 'react';
import ChartSvg from './ChartSvg';
import Bar from './Bar';

const Chart = () => {
    const planets = JSON.parse(localStorage.getItem("fetchedPlanets"));
    const maxPopulation = 2000;
    const chartHeight = maxPopulation + 200;
    const barWidth = 1000;
    const barMargin = 300;
    const numberofBars = planets.length;
    let width = numberofBars * (barWidth + barMargin);

    return (
        <>
            <h3>Planet Population</h3>
            <ChartSvg height={chartHeight} width={width}>
                {planets.map((data, index) => {
                    let barHeight;
                    if (data.population >= 2000000000) {
                        barHeight = data.population / 2500000
                    } else {
                        barHeight = data.population / 25000
                    }

                    return (
                        <Bar
                            key={data.name}
                            x={index * (barWidth + barMargin)}
                            y={chartHeight - barHeight}
                            width={barWidth}
                            height={barHeight}
                            planetName={data.name}
                        />
                    );
                })}
            </ChartSvg>
        </>
    );
}


export default Chart;