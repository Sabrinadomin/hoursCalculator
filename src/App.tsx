import React, { FormEventHandler } from "react";
import "./App.css";

type Props = {
	name: string
}

interface State {
	hours: string[];
	minutes: string[];
  sentInputs: string[];
  timeCalculated: string[];
}

interface Hour {
	hour: string;
	minute: string;	
}
class App extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			hours: [],
			minutes: [],
			sentInputs: [],
			timeCalculated: [],
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

	timeStringToSeconds(timeString: string): number {
		const [hours, minutes] = timeString.split(":").map((str) => parseInt(str, 10));
		return hours * 3600 + minutes * 60;
	}

	calculateHours(start: number, end: number) {
		return end - start;
	}

	secondsToTimeString(totalSeconds: number): string {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	}

	formatTime(hour: Hour): string {
		return `${hour.hour.padStart(2, "0")}: ${hour.minute.padStart(2, "0")}`;
	}

	handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const startHourSelect = form.elements.namedItem("start-time-hour") as HTMLInputElement;
		const startMinutesSelect = form.elements.namedItem("start-time-minute") as HTMLInputElement;
		const endHourSelect = form.elements.namedItem("end-time-hour") as HTMLInputElement;
		const endMinutesSelect = form.elements.namedItem("end-time-minute") as HTMLInputElement;
		
		const [startHour, startMinutes] = [startHourSelect.value, startMinutesSelect.value];
		const [endHour, endMinutes] = [endHourSelect.value, endMinutesSelect.value];

		const startTimeSeconds = this.timeStringToSeconds(this.formatTime({ hour: startHour, minute: startMinutes }));
		const endTimeSeconds = this.timeStringToSeconds(this.formatTime({ hour: endHour, minute: endMinutes }));
		const formattedInput = `${startHour.padStart(2,)}:${startMinutes} to ${endHour}:${endMinutes} => `;

		const seconds = this.calculateHours(startTimeSeconds, endTimeSeconds);
		this.setState(state => ({
			sentInputs: [...state.sentInputs, formattedInput],
			timeCalculated: [...state.timeCalculated, this.secondsToTimeString(seconds)]
		}));

		console.log(this.state);
		console.log(formattedInput + this.secondsToTimeString(seconds));

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

					<label>Select End Time:</label>
					<select name="end-time-hour">
						{hours.map(this.renderOptions)}
					</select>

					<select name="end-time-minute">
						{minutes.map(this.renderOptions)}
					</select>
					<button type="submit">Calculate</button>
				</form>
			</div>


		);
	}
}

export default App;
