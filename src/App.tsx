import React, { FormEventHandler, useState } from "react";
import "./App.css";

type Props = {
	name: string
}
class App extends React.Component {

	constructor(props: Props) {
		super(props);
		
		this.state = {
			hours: [],
			minutes: [],
		};
	}

	componentDidMount() {
		const hours = [];
		const minutes = [];
	
		for (let i = 0; i < 24; i++) {
			hours.push(i.toString().padStart(2, "0"));
		}
	
		for (let i = 0; i < 60; i++) {
			minutes.push(i.toString().padStart(2, "0"));
		}
	
		this.setState({ hours, minutes });
	}

	renderOptions(item: string) {
		return <option value={item} key={item} >{item.padStart(2, "0")}</option>;
	}

	handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
	};

	render() {
		const hours = [];
		const minutes = [];
		for (let i = 0; i < 24; i++) {
			hours.push(i.toString());
		}

		for (let i = 0; i < 60; i++) {
			minutes.push(i.toString());
		}

		return (
			<div>
				<h2>Hours Calculator</h2>
				<form onSubmit={this.handleSubmit}>
					<label>Select Start Time:</label>
					<select name="start-time-hour">
						{hours.map(this.renderOptions)}
					</select>

					<select name="start-time-minute">
						{minutes.map(this.renderOptions)}
					</select>

					<label>Select End Hour:</label>
					<select name="end-time-hour">
						{hours.map(this.renderOptions)}
					</select>

					<select name="end-time-minute">
						{minutes.map(this.renderOptions)}
					</select>
					<button type="submit">Send</button>
				</form>
			</div>
		);
	}
}

export default App;
