import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Weather from './components/Weather'

class App extends React.Component {
	render() {
		return (
			<div className='container'>
				<Weather />
			</div>
		)
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('app')
)