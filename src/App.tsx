import React, { FormEventHandler } from "react";
import { CgArrowLongRight } from "react-icons/cg";
import { FaWindowClose } from "react-icons/fa";
import "./App.css";

type Props = {
	name: string
}

interface State {
	hours: string[];
	minutes: string[];
  sentInputs: string[];
  timeCalculated: string[];
	totalSeconds: number;
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
			totalSeconds: 0,
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

	mountResult = (input: string, index: number) => {
		return <li key={index}>
			{input}
			<CgArrowLongRight className='li-arrow'/>
			{this.state.timeCalculated[index]}
			<span className='delete'>
				<FaWindowClose
					// onClick={ (e) => this.deleteTask(e, index) }
					className='delete'
				/>
			</span>
		</li>;
	};

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
		return `${this.formatTime({hour: hours.toString(), minute: minutes.toString()})}`;
	}

	formatTime(hour: Hour): string {
		return `${hour.hour.padStart(2, "0")}:${hour.minute.padStart(2, "0")}`;
	}

	handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		const { totalSeconds } = this.state;
		const form = event.target as HTMLFormElement;
		const startHourSelect = form.elements.namedItem("start-time-hour") as HTMLInputElement;
		const startMinutesSelect = form.elements.namedItem("start-time-minute") as HTMLInputElement;
		const endHourSelect = form.elements.namedItem("end-time-hour") as HTMLInputElement;
		const endMinutesSelect = form.elements.namedItem("end-time-minute") as HTMLInputElement;
		
		const [startHour, startMinutes] = [startHourSelect.value, startMinutesSelect.value];
		const [endHour, endMinutes] = [endHourSelect.value, endMinutesSelect.value];

		const startTimeSeconds = this.timeStringToSeconds(this.formatTime({ hour: startHour, minute: startMinutes }));
		const endTimeSeconds = this.timeStringToSeconds(this.formatTime({ hour: endHour, minute: endMinutes }));
		const formattedInput = `${this.formatTime({hour: startHour, minute: startMinutes})} to ${this.formatTime({hour: endHour, minute: endMinutes})}`;

		const seconds = this.calculateHours(startTimeSeconds, endTimeSeconds);

		this.setState(state => ({
			sentInputs: [...state.sentInputs, formattedInput],
			timeCalculated: [...state.timeCalculated, this.secondsToTimeString(seconds)],
			totalSeconds: totalSeconds + seconds
		}));
	};
		
	render() {
		const { sentInputs, hours, minutes, totalSeconds } = this.state;
	
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

				<ul>
					{ sentInputs.map((input, index) => (this.mountResult(input, index))) }
				</ul>

				{totalSeconds !== 0 ? <p>Total Hours: {this.secondsToTimeString(totalSeconds)}</p> : ""}
			</div>


		);
	}
}

export default App;
