import React, { useEffect, useState, useCallback } from 'react';
import { commafy } from '../utilities/utilities';

const Table = () => {
    const [largestPopulationVehicle, setLargestPopulationVehicle] = useState({});
    const [largestPopulationVehiclePilots, setLargestPopulationVehiclePilots] = useState("");
    const [largestPopulationVehiclePlanets, setLargestPopulationVehiclePlanets] = useState("");
    const vehicles = JSON.parse(localStorage.getItem("fetchedVehicles"));
    let vehicleArr = [];
    let largestVehiclePopulation;
    let pilots = [];
    let planets = [];

    const getPilots = async () => {
        const pilots = [];
        vehicleArr.forEach(vehicle => {
            pilots.push(...vehicle.pilots);
        });

        const promises = pilots.map((pilot) => fetch(pilot).then(res => res.json()))
        return Promise.all(promises);
    }

    const getPlanets = async (pilots) => {
        const planets = [];
        pilots.forEach(pilot => {
            planets.push(pilot.homeworld);
        });

        const promises = planets.map((planets) => fetch(planets).then(res => res.json()))
        return Promise.all(promises);
    }

    const getLargestSumOfPopulation = (vehicles) => {
        vehicles.map(vehicle => {
            vehicle.pilots.forEach(pilot => {
                if (!isNaN(pilot.planet.population)) {
                    vehicle.sumOfPlanetsPopulation = (parseInt(vehicle.sumOfPlanetsPopulation) || 0) + parseInt(pilot.planet.population);
                }
            })

            vehicles.map(v => {
                if (vehicle.sumOfPlanetsPopulation > v.sumOfPlanetsPopulation) {
                    largestVehiclePopulation = vehicle;
                }
            })
        })

        largestVehiclePopulation.pilots.map(pilot => {
            if (largestVehiclePopulation.pilots.length > 1) {
                pilots.push(pilot.name + ", ");
                planets.push(`${pilot.planet.name}: ${commafy(pilot.planet.population)},`)
            } else {
                pilots.push(pilot.name);
                planets.push(`${pilot.planet.name}: ${commafy(pilot.planet.population)}`)
            }
        })

        setLargestPopulationVehicle(largestVehiclePopulation);
        setLargestPopulationVehiclePilots(pilots);
        setLargestPopulationVehiclePlanets(planets);

        localStorage.setItem('largestPopulationVehicle', JSON.stringify(largestVehiclePopulation));
        localStorage.setItem('largestPopulationVehiclePilots', JSON.stringify(pilots));
        localStorage.setItem('largestPopulationVehiclePlanets', JSON.stringify(planets));

    }

    const getVehiclesPilotsPlanets = useCallback(async (vehicles) => {
    
            vehicles.forEach(vehicle => {
                vehicleArr.push({ name: vehicle.name, pilots: vehicle.pilots });
            })
    
            const pilots = await getPilots();
    
            // put pilot data inside each vehicle
            vehicleArr.map((v, index) => {
                v.pilots.map((p, pilotIndex) => {
                    pilots.map(p2 => {
                        if (p === p2.url) {
                            vehicleArr[index].pilots[pilotIndex] = p2;
                        }
                    })
                })
            })
    
            const planets = await getPlanets(pilots);
    
            // put planet data inside each pilot
            vehicleArr.map((v, vechileIndex) => {
                v.pilots.map((p, pilotIndex) => {
                    planets.map(planet => {
                        if (p.homeworld === planet.url) {
                            vehicleArr[vechileIndex].pilots[pilotIndex].planet = planet;
                        }
                    })
                })
            })
    
            // get vehicle with the highest sum of population for all its pilots’ home planets
            getLargestSumOfPopulation(vehicleArr);
    }, [vehicles])

    useEffect(() => {
            getVehiclesPilotsPlanets(vehicles);
    }, [])
    
    return (
        <>
            <h3>vehicle with the highest sum of population for all its pilots’ home planets</h3>
            <table>
                <tbody>
                    <tr>
                        <td>vehicle name with the largest sum</td>
                        <td>{largestPopulationVehicle.name}</td>
                    </tr>
                    <tr>
                        <td>Related home planets and their respective population</td>
                        <td>
                            {largestPopulationVehiclePlanets}
                        </td>
                    </tr>
                    <tr>
                        <td>Related pilot names</td>
                        <td>
                            {largestPopulationVehiclePilots}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Table;