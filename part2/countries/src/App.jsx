import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all/";
  const [countryInput, setCountryInput] = useState("");
  const [countries, setCountries] = useState(null);

  const handleChangeInput = (e) => {
    setCountryInput(e.target.value);
  };

  const fullCountryInfo = (country) => {
    if (country) {
      const languages = Object.values(country.languages).map(
        (language) => language
      );
      return (
        <>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital[0]}</p>
          <p>Area: {country.area}</p>
          <p>
            <strong>Languages:</strong>
          </p>
          <ul>
            {languages.map((language, index) => (
              <li key={country.population + index}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} />
        </>
      );
    }
    return null;
  };


  const Country = ({ item }) => {
    const [show, setShow] = useState(false);

    const handleShowHide = () => {
      setShow(!show);
    };

    return (
      <>
        <p key={`id-${item.area}`}>
          {item.name.common}
          <button onClick={handleShowHide}>{show ? 'Hide' : 'Show'}</button>
        </p>
        {show ? fullCountryInfo(item) : null}
      </>
    );
  };

  const CountriesList = ({ countries }) => {
    return countries.map((item, index) => (
      <>
        <Country key={item.area + index} item={item} />
      </>
    ));
  };

  const FilteredList = ({ countries, countryInput }) => {
    const manyMathes = "Too many matches, specify another filter";

    if (countries && countryInput) {
      const filteredCountries = countries
        .filter((country) =>
          country.name.common.toLowerCase().includes(countryInput.toLowerCase())
        )
        .map((item) => item);

      if (filteredCountries.length === 1) {
        return fullCountryInfo(filteredCountries[0]) 
      } else if (filteredCountries.length > 10) {
        return <p>{manyMathes}</p>;
      } else {
        return <CountriesList countries={filteredCountries} />;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!countries) {
      axios.get(`${baseUrl}`).then((response) => {
        setCountries(response.data);
      });
    } 
  }, []);

  return (
    <>
      {console.log(countries)}
      <label htmlFor="countries">find countries</label>
      <input
        id="countries"
        type="text"
        value={countryInput}
        onChange={handleChangeInput}
      />
      <FilteredList countries={countries} countryInput={countryInput} />
    </>
  );
}

export default App;
