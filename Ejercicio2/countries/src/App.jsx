import { useState, useEffect } from 'react'
import axios from 'axios'



const FirstCountryContent = ({ name, ccn3, showAllInfo }) => {
  return (
    <div>
      <li key={ccn3}>{name}</li>
      <button onClick={showAllInfo}>show</button>
    </div>
  )
}
const CountryContent = ({ name, capital, area, languages, imgUrl }) => {
  const [weather,setWeather] = useState()

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=a5ce8e2c8c3b690d9b96eb6ee3e86cb1`)
      .then((response) => {
        const apiResponse = response.data
        console.log(apiResponse)
        setWeather(apiResponse)

      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  return (
    <div className="country-content">
      <h2>{name}</h2>
      <p>Capital : {capital}</p>
      <p>Area : {area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      <img src={imgUrl} />
      {weather && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>Temperature: {(weather.main.temp)- 273} ºCelsius Grades</p>
          <p>Description: {weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
          <p>Wind: Speed {weather.wind.speed}  Direction: {weather.wind.deg} </p>
        </div>
      )}
    </div>

  )

}



const App = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countryName, setCountryName] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [countryFilterLength, setCountryFilterLength] = useState()
  const [countryInfoShowed, setCountryInfoShowed] = useState(null)

  useEffect(() => {
    console.log('effect run, country is now', countryName)

    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then(response => {
      console.log(response.data)
      setCountries(response.data)
    })
  }, [])

  const handleShowInfo = (country) => {
    setCountryInfoShowed(country);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value

    setSelectedCountry(inputValue)
    setCountryName(inputValue)
    setCountryInfoShowed(null)
    const matchingCountries = countries.filter(country => country.name.common.toLowerCase().includes(inputValue.toLowerCase()))
    setCountryFilterLength(matchingCountries.length)


    if (matchingCountries.length > 10) {
      setErrorMessage('No se pueden mostrar más de 10 países. Por favor, ajusta tu búsqueda.');
    } else {
      setErrorMessage('');
    }

  }

  return (
    <div>
      <form>
        Country Search: <input value={selectedCountry} onChange={handleChange} />
      </form>
      {errorMessage && <p>{errorMessage}</p>}

      <ul>
        {countryFilterLength <= 10 && countries
          .filter(country => country.name.common.toLowerCase().includes(selectedCountry.toLowerCase()))
          .map(country => (
            <div key={country.ccn3}>
              <FirstCountryContent key={country.ccn3} name={country.name.common} country={country} showAllInfo={() => handleShowInfo(country)} />
            </div>
          ))}

      </ul>
      {countryInfoShowed && (
        <CountryContent
          name={countryInfoShowed.name.common}
          capital={countryInfoShowed.capital}
          area={countryInfoShowed.area}
          languages={countryInfoShowed.languages}
          imgUrl={countryInfoShowed.flags.png}
        />
      )}
    </div>
  )

}

export default App
