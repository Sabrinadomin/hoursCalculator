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
	totalMinutes: number;
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
			totalMinutes: 0,
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
					onClick={ () => this.deleteCalculation(index) }
					className='delete'
				/>
			</span>
		</li>;
	};

	deleteCalculation = (index: number) => {
		const { sentInputs, timeCalculated, totalMinutes } = this.state;
		const newTimes = [...timeCalculated];
		const newInputs = [...sentInputs];
		const removedTime = newTimes.splice(index, 1)[0];

		newInputs.splice(index, 1);

		this.setState({
			sentInputs: [...newInputs],
			timeCalculated: [...newTimes],
			totalMinutes: totalMinutes - this.timeStringToMinute(removedTime),
		});
	};

	timeStringToMinute(timeString: string): number {
		const [hours, minutes] = timeString.split(":").map((str) => parseInt(str, 10));
		return hours * 60 + minutes;
	}

	minutesToTimeString(totalMinutes: number): string {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = Math.floor(totalMinutes - hours * 60);
		return `${this.formatTime({hour: hours.toString(), minute: minutes.toString()})}`;
	}

	formatTime(hour: Hour): string {
		return `${hour.hour.padStart(2, "0")}:${hour.minute.padStart(2, "0")}`;
	}

	handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		const { totalMinutes } = this.state;
		const form = event.target as HTMLFormElement;
		
		const startHour = form.elements.namedItem("start-time-hour") as HTMLInputElement;
		const startMinutes = form.elements.namedItem("start-time-minute") as HTMLInputElement;

		const endHour = form.elements.namedItem("end-time-hour") as HTMLInputElement;
		const endMinutes = form.elements.namedItem("end-time-minute") as HTMLInputElement;

		const startTimeMinutes = Number(startHour.value) * 60 + Number(startMinutes.value);
		const endTimeMinutes = Number(endHour.value) * 60 + Number(endMinutes.value);

		let calculatedMinutes = endTimeMinutes < startTimeMinutes ? startTimeMinutes - (endTimeMinutes + 1440) : startTimeMinutes - endTimeMinutes;
		calculatedMinutes = calculatedMinutes < 0 ? - calculatedMinutes : calculatedMinutes;

		const formattedInput = `${this.formatTime({hour: startHour.value, minute: startMinutes.value})} to ${this.formatTime({hour: endHour.value, minute: endMinutes.value})}`;
		
		if(calculatedMinutes !== 0) {
			this.setState(state => ({
				sentInputs: [...state.sentInputs, formattedInput],
				timeCalculated: [...state.timeCalculated, this.minutesToTimeString(calculatedMinutes)],
				totalMinutes: totalMinutes + calculatedMinutes
			}));
		}
	};
		
	render() {
		const { sentInputs, hours, minutes, totalMinutes } = this.state;
 
		return (
			<div>
				<h2>Hours Calculator</h2>
				<form onSubmit={this.handleSubmit}>
					<label>Select Start Time:</label>
					<select className='select' name="start-time-hour">
						{hours.map(this.renderOptions)}
					</select>

					<select className='select' name="start-time-minute">
						{minutes.map(this.renderOptions)}
					</select>

					<label>Select End Time:</label>
					
					<select className='select' name="end-time-hour">
						{hours.map(this.renderOptions)}
					</select>

					<select className='select' name="end-time-minute">
						{minutes.map(this.renderOptions)}
					</select>
					<button type="submit">Calculate</button>
				</form>

				<ul>
					{ sentInputs.map((input, index) => (this.mountResult(input, index))) }
				</ul>

				{totalMinutes !== 0 ? <p>Total Hours: {this.minutesToTimeString(totalMinutes)}</p> : ""}
			</div>

		);
	}
}

export default App;
