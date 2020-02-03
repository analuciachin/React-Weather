import React from 'react'


export default class Weather extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			city: '',
			country: '',
			weatherData: null,
			error: null,
			results: false,
			res_city: null,
			res_country: null,
			res_weather: null,
			res_temp: null,
			res_temp_min: null,
			res_temp_max: null,
			res_icon: null
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChangeCity = this.handleChangeCity.bind(this)
		this.handleChangeCountry = this.handleChangeCountry.bind(this)
		this.handleError = this.handleError.bind(this)
	}

	handleSubmit(event) {
		event.preventDefault()
		//alert(`${this.state.city} ${this.state.country}`)
		console.log('city:', this.state.city, 'country:', this.state.country)

		const API_KEY='c0e069a1e1238bcf2a556cf63b14a967'
		const endpoint = window.encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.city},${this.state.country}&APPID=${API_KEY}`)

		fetch(endpoint)
			.then(response => {
				if(!response.ok) {
					throw new Error();
				}
				return response.json();
			})
			.then((data) => this.setState({ 
				weatherData: data,
				error: null,
				results: true,
				city: '',
				country: '',
				res_city: data.name,
				res_country: data.sys.country,
				res_weather: data.weather[0].main,
				res_icon: data.weather[0].icon,
				res_temp: data.main.temp,
				res_temp_min: data.main.temp_min,
				res_temp_max: data.main.temp_max
			}))			
			.catch((error) => {
				console.warn('Error fetching weather info: ', error)

				this.setState ({
					error: `There was an error fetching the weather info.`,
					city:'',
					country:''
				})
			})
	}

	handleChangeCity(event) {
		this.setState({
			city: event.target.value
		})
	}

	handleChangeCountry(event) {
		this.setState({
			country:event.target.value
		})
	}

	handleError() {
		if (this.state.error) {
			return <p className='error'>{ this.state.error }</p>
		}
	}



	render() {
		//console.log(this.props)
		const { results, error, city, country, res_city, res_country, res_weather, res_temp, res_temp_min, res_temp_max, res_icon } = this.state

		return (
			<React.Fragment>
				<h1 className='title'>Weather Finder</h1>
				<form onSubmit={this.handleSubmit}>
					<div className='row'>
						<input 
							type='text'
							id='city'
							className='input-light form-inputs'
							placeholder='city'
							autoComplete='off'
							value={city}
							onChange={this.handleChangeCity}
						/>
						<input 
							type='text'
							id='country'
							className='input-light form-inputs'
							placeholder='country code'
							autoComplete='off'
							value={country}
							onChange={this.handleChangeCountry}
						/>
						<button
							type='submit'
							className='btn'
							disabled={!city && !country}
						>
							Get Weather
						</button>
					</div>
				</form>

				{ results &&
					<div className='weather-result'>
						<img className='weather-icon'
							src={`http://openweathermap.org/img/wn/${res_icon}@2x.png`} 
							alt={`${res_weather} icon`}
						/>
						<p><label className='label-color'>Location:</label> {res_city} , {res_country}</p>
						<p><label className='label-color'>Weather Conditions:</label> {res_weather}</p>
						<p><label className='label-color'>Temperature:</label> {res_temp}</p>
						<p><label className='label-color'>Min Temperature:</label> {res_temp_min}</p>
						<p><label className='label-color'>Max Temperature:</label> {res_temp_max}</p>

					</div>
				}

				{ this.handleError() }

        {/*<pre>{JSON.stringify(this.state.weatherData, null, 2)}</pre>*/}
			
			</React.Fragment>
		)
	}
}
	