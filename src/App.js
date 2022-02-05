import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Table from './components/Table';
import Chart from './components/chart/Chart';
import yoda from './assets/images/yoda.gif';
import './style.css';

function App() {
  const [loading, setLoading] = useState(true);

  async function getData() {
    //Utility functions for fetch.
    const baseUrl = "https://swapi.py4e.com/api";
    const urls = [`${baseUrl}/vehicles`, `${baseUrl}/planets`];
    const checkStatus = res => res.ok ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));
    const parseJSON = response => response.json();

    // Get a single endpoint.
    const getPage = url => fetch(url)
      .then(checkStatus)
      .then(parseJSON)
      .catch(error => console.log("There was a problem!", error));

    // Keep getting the pages until the next key is null.
    const getAllPages = async (url, collection = []) => {
      const { results, next } = await getPage(url);
      collection = [...collection, ...results];
      if (next !== null) {
        return getAllPages(next, collection);
      }
      // filter only vehicles which have pilots (Could not find an API parameter that performs this filter - would have been more efficient).
      return collection;
    }

    // Select data out of all the pages gotten.
    const [fetchedVehicles, fetchedPlanets] = await Promise.all(urls.map(url => getAllPages(url)));

    // Return only vahicles which have pilots
    const fetchedVehiclesWithPilots = fetchedVehicles.filter(vehicle => { return vehicle.pilots.length > 0 });

    // Arrange related planets data for Chart component
    const relatedPlanets = ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"];
    const RelatedFetchedPlanets = fetchedPlanets.filter(planet => {
      return relatedPlanets.includes(planet.name);
    }).map(planet => {
      return ({ name: planet.name, population: parseInt(planet.population) });
    })

    //set vehicles and planets data to local states - wrong practice - means that fetch of data will occur on every part change.
    // setVehicles(fetchedVehiclesWithPilots);
    // setPlanets(RelatedFetchedPlanets);

    //set vehicles and planets data to local storage
    localStorage.setItem('fetchedVehicles', JSON.stringify(fetchedVehiclesWithPilots));
    localStorage.setItem('fetchedPlanets', JSON.stringify(RelatedFetchedPlanets));
  }

  useEffect(() => {
    getData();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);


  return (
    <div className="App">
      <h1> Star Wars Assignment</h1>
      {loading &&
        <>
          <img src={yoda} width={250} />
          <span>Loading...</span>
        </>
      }

      <Routes>
        <Route path="/" element={!loading && <Table />} />
        <Route path="part-two" element={!loading && <Chart />} />
      </Routes>

      {!loading &&
        <div className='part-selection'>
          <Link to="/">Part 1</Link>
          <Link to="/part-two">Part 2</Link>
        </div>
      }
    </div>
  );
}

export default App;
