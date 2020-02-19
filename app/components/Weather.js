import React from 'react'
import PropTypes from 'prop-types'


function DegreeTypeNav({ selected, onUpdateDegreeType }) {
	const degreeTypes = ['Celsius', 'Fahrenheit']

	return(
		<ul className='flex-center'>
			{degreeTypes.map((degreeType) => (
				<li key={degreeType}>
					<button 
						className='btn-clear nav-link'
						style={degreeType === selected ? { color: 'rgb(187,46,31)' } : null }
						onClick={() => onUpdateDegreeType(degreeType)}>
						{degreeType}
					</button>
				</li>
			))}
		</ul>
	)
}

DegreeTypeNav.propTypes = {
	selected: PropTypes.string.isRequired,
	onUpdateDegreeType: PropTypes.func.isRequired
}


function Result({ degreeType, icon, weather, city, country, temp, temp_min, temp_max }) {
	return (
		<div className='weather-result'>
			<h2 className='current-title center-text'>Current Weather</h2>
			<p className='current-main-info center-text'>{city} , {country}</p>
			<img className='current-weather-icon'
				src={`http://openweathermap.org/img/wn/${icon}@2x.png`} 
				alt={`${weather} icon`}
			/>
			{ degreeType === 'Celsius'
				? <p className='current-main-info center-text'>{temp}°C</p>
				: <p className='current-main-info center-text'>{temp}°F</p>
			}
			<p className='current-detail-info center-text'> {weather}</p>
			{ degreeType === 'Celsius'
				? <p className='current-detail-info center-text'>{temp_min}°C / {temp_max}°C</p>
				: <p className='current-detail-info center-text'>{temp_min}°F / {temp_max}°F</p>
			}
		</div>
	)
}

Result.propTypes = {
	degreeType: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	weather: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	temp: PropTypes.string.isRequired,
	temp_min: PropTypes.string.isRequired,
	temp_max: PropTypes.string.isRequired
}

class LocationInput extends React.Component {
	constructor(props) {
		super(props)

		this.state= {
			city: '',
			country: ''
		}

		this.handleChangeCity = this.handleChangeCity.bind(this)
		this.handleChangeCountry = this.handleChangeCountry.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}


	handleSubmit(event) {
		event.preventDefault()
		//alert(`${this.state.city} ${this.state.country}`)
		//console.log('city:', this.state.city, 'country:', this.state.country)

		this.props.onSubmit(this.state.city, this.state.country)

		this.setState({
			city:'',
			country:''
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


	render() {
	return (
			<form onSubmit={this.handleSubmit}>
				<div className='row'>
					<input 
						type='text'
						id='city'
						className='input-light form-inputs'
						placeholder='city'
						autoComplete='off'
						value={this.state.city}
						onChange={this.handleChangeCity}
					/>
					<input 
						type='text'
						id='country'
						className='input-light form-inputs'
						placeholder='country code'
						autoComplete='off'
						value={this.state.country}
						onChange={this.handleChangeCountry}
					/>
					<button
						type='submit'
						className='btn'
						disabled={!this.state.city && !this.state.country}
					>
						Get Weather
					</button>
				</div>
			</form>
		)
	}
}

LocationInput.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

class Forecast extends React.Component {

	constructor(props) {
		super(props)

		this.state ={
			fullData: [],
			dailyData: [],
			error: null
		}

		this.getDayOfWeek = this.getDayOfWeek.bind(this)
		this.toggleDegreeType = this.toggleDegreeType.bind(this)
	}

	componentDidMount() {
		const API_KEY='c0e069a1e1238bcf2a556cf63b14a967'
		const endpoint = window.encodeURI(`http://api.openweathermap.org/data/2.5/forecast?id=${this.props.city_id}&appid=${API_KEY}`)


		fetch(endpoint)
			.then(response => {
				if(!response.ok) {
					throw new Error();
				}
				return response.json();
			})
			.then((data) => this.setState({ 
				fullData: data.list,
				dailyData: data.list.filter(reading => reading.dt_txt.includes("18:00:00")),
				error: null
			}))
			.catch((error) => {
				console.warn('Error fetching weather forecast info: ', error)

				this.setState ({
					error: `There was an error fetching the weather forecast info.`
				})
			})
		}

		getDayOfWeek(unixTimestamp) {
			const dayWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
			let dayNum = new Date(unixTimestamp * 1000).getDay()
			let result = dayWeek[dayNum]
			return result
		}


		toggleDegreeType(selectedDegree, temp) {
			if(this.props.selectedDegree === 'Celsius') {
				//console.log(this.props.selectedDegree, temp)
				temp = temp - 273.15
			}
			else {
				//console.log(this.props.selectedDegree, temp)
				temp = (temp - 273.15) * 9/5 + 32
			}
			return temp
		}


		render() {
			return(
				<div>
					{/*<p>{this.state.dailyData.length}</p>
					<pre>{JSON.stringify(this.state.dailyData, null, 2)}</pre>*/}
					<p>{this.state.selectedDegree}</p>
					<ForecastGrid 
						weatherForecasts={this.state.dailyData}
						getWeekDay={this.getDayOfWeek}
						updateDegree={this.toggleDegreeType}
						selectedDegree={this.props.selectedDegree}
					/>
				</div>
			)
		}
}

Forecast.propTypes = {
	city_id: PropTypes.number.isRequired,
	selectedDegree: PropTypes.string.isRequired
}


function ForecastGrid({ weatherForecasts, getWeekDay, selectedDegree, updateDegree }) {
	//console.log(getWeekDay, selectedDegree)
	return(
		<div className='forecast-section'>
			<h2 className='title-forecast'>Forecast - 5 days</h2>
			<ul className='grid space-around'>
				{weatherForecasts.map((forecast) => {
					const { main, weather, dt_txt, dt} = forecast
					const { temp } = main
					const { description, icon } = weather[0]
					return (
						<li key={dt_txt}>
							<p className='center-text forecast-main-info'>{getWeekDay(dt)}</p>
							<p className='center-text forecast-detail-info'>{dt_txt}</p>
							<img className='forecast-weather-icon'
								src={`http://openweathermap.org/img/wn/${icon}@2x.png`} 
								alt={`${description} icon`}
							/>
							{ selectedDegree === 'Celsius'
								? <p className='center-text forecast-main-info'>
										{updateDegree(selectedDegree,temp).toFixed(0)}°C
									</p>
								: <p className='center-text forecast-main-info'>
										{updateDegree(selectedDegree,temp).toFixed(0)}°F
									</p>
							}
							<p className='center-text forecast-detail-info'>{description}</p>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

ForecastGrid.propTypes = {
	weatherForecasts: PropTypes.array.isRequired,
	getWeekDay: PropTypes.func.isRequired,
	selectedDegree: PropTypes.string.isRequired,
	updateDegree: PropTypes.func.isRequired
}


export default class Weather extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			selectedDegreeType: 'Celsius',
			weatherData: null,
			error: null,
			results: false,
			res_city: null,
			res_country: null,
			res_weather: null,
			res_temp: null,
			res_temp_min: null,
			res_temp_max: null,
			res_icon: null,
			res_city_id: null
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleError = this.handleError.bind(this)
		this.updateDegreeType = this.updateDegreeType.bind(this)
	}

	handleSubmit(city, country) {
		console.log(city, country)

		const API_KEY='c0e069a1e1238bcf2a556cf63b14a967'
		const endpoint = window.encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${API_KEY}`)

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
				res_city: data.name,
				res_country: data.sys.country,
				res_weather: data.weather[0].description,
				res_icon: data.weather[0].icon,
				res_temp: data.main.temp - 273.15,
				res_temp_min: data.main.temp_min - 273.15,
				res_temp_max: data.main.temp_max - 273.15 ,
				res_city_id: data.id,
				selectedDegreeType: 'Celsius'
			}))
			.catch((error) => {
				console.warn('Error fetching weather info: ', error)

				this.setState ({
					error: `There was an error fetching the weather info.`,
					city:'',
					country:'',
					results:false
				})
			})
	}

	handleError() {
		if (this.state.error) {
			return <p className='error'>{ this.state.error }</p>
		}
	}


	updateDegreeType(selectedDegreeType) {
		if(this.state.selectedDegreeType === 'Celsius') {
			//console.log(this.state.selectedDegreeType)
			this.setState(({ res_temp, res_temp_min, res_temp_max }) => ({
				selectedDegreeType,
				res_temp: (res_temp * 9/5) + 32,
				res_temp_min: (res_temp_min) * 9/5 + 32,
				res_temp_max: (res_temp_max) * 9/5 + 32,
			})
		)}
		else {
			//console.log(this.state.selectedDegreeType)
			this.setState(({ res_temp, res_temp_min, res_temp_max }) => ({
				selectedDegreeType,
				res_temp: (res_temp - 32) * 5/9,
				res_temp_min: (res_temp_min - 32) * 5/9,
				res_temp_max: (res_temp_max - 32) * 5/9,
			})
		)}
	}


	render() {
		//console.log(this.props)
		//onSubmit={(city, country) => console.log(city, country)}
		//onSubmit={(city, country) => this.handleSubmit(city, country)}

		const { selectedDegreeType, results, res_icon, res_weather, res_city, res_country, res_temp, res_temp_min, res_temp_max, res_city_id} = this.state

		return (
			<React.Fragment>
				<h1 className='title center-text'>Weather Finder</h1>
				<LocationInput
					onSubmit={(city, country) => this.handleSubmit(city, country)}
				/>
				{ results &&
					<DegreeTypeNav 
						selected={selectedDegreeType} 
						onUpdateDegreeType={this.updateDegreeType}
					/>
				}

				{ results &&
					<Result
						degreeType={selectedDegreeType}
						icon={res_icon}
						weather={res_weather}
						city={res_city}
						country={res_country}
						temp={res_temp.toFixed(0)}
						temp_min={res_temp_min.toFixed(0)}
						temp_max={res_temp_max.toFixed(0)}
					/>
				}

				{ results &&
					<Forecast
						city_id={res_city_id}
						selectedDegree={selectedDegreeType}
					/>
				}

				{ this.handleError() }

				{/*<pre>{JSON.stringify(this.state.weatherData, null, 2)}</pre>*/}
			
			</React.Fragment>
		)
	}
}
	