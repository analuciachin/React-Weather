import React from 'react'

class Results extends React.Component {
	render() {
		return (
			<div>
				<p>Location: </p>
				<p>Temperature: </p>
				<p>Weather Conditions: </p>
			</div>
		)
	}

}

class LocationInput extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			city: '',
			country: '',
			weatherData: null,
			error: null
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChangeCity = this.handleChangeCity.bind(this)
		this.handleChangeCountry = this.handleChangeCountry.bind(this)
	}

	handleSubmit(event) {
		event.preventDefault()

		this.props.onSubmit(this.state.city, this.state.country)

		const endpoint = window.encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=toronto,ca&APPID=c0e069a1e1238bcf2a556cf63b14a967`)

		fetch(endpoint)
			.then(response => {
				if(!response.ok) {
					throw new Error();
				}
				return response.json();
			})
/*			.then((data) => this.setState({ 
				weatherData: data,
				error: null 
			}))
/*			.catch(() => {
				console.warn('Error fetching weather info: ', error)

				this.setState ({
					error: `There was an error fetching the weather info.`
				})
			})
*/
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
		//console.log(this.props)
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
						placeholder='country'
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


export default class Weather extends React.Component {

	constructor(props) {
			super(props)

			this.state = {
				has_results: false
			}
	}

	render() {
		const { has_results } = this.state 

		return (
			<React.Fragment>
				<LocationInput 
					onSubmit={(value1, value2) => console.log('city:', value1, 'country:', value2)}

				/>

				{<pre>JSON.stringify(weatherData, null, 2)</pre>}

				{ has_results &&
					<Results />
				}

			</React.Fragment>
		)
	}

}
