import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import FlightDetails from './flightDetails';


const url = "http://localhost:1050/getFlights/";

export default class GetFlights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableFlights: null,
            form: {
                origin: "",
                destination: "",
                departureDate: "",
                noOfTickets: 0
            },
            formErrorMessage: {
                originError: "",
                destinationError: "",
                departureDateError: "",
                noOfTicketsError: ""
            },
            formValid: {
                originfield: false,
                destinationfield: false,
                departureDatefield: false,
                noOfTicketsfield: false,
                buttonActive: false,
            },
            errorMessage: "",

        }
    }
    submitBooking = () => {
        // Make an axios get request to get the flights in the specified route
        // populate the availableFlights or errorMessage appropriately
        axios.get(url + this.state.form.origin + "/" + this.state.form.destination)
            .then((response) => {
                this.setState({ availableFlights: response.data, errorMessage: "" })
            })
            .catch((error) => {
                if (error.response) {
                    //console.log(error.response);
                    //console.log(error.response.data.message);
                    this.setState({ errorMessage: error.response.data.message })
                } else {
                    //console.log(error);
                    this.setState({ errorMessage: error.message })
                }
            })
    };
    handleSubmit = event => {
        // Prevent the default behaviour of form submission
        // Call appropriate method to make the axios get request
        event.preventDefault();
        this.submitBooking();
    };
    handleChange = event => {
        // Get the names and values of the input fields
        // Update the formValue object in state
        // Call the validateField method by passing the name and value of the input field
        let { form } = this.state;
        let eventName = event.target.name;
        let eventValue = event.target.value;
        form[eventName] = eventValue;
        this.setState({ form: form }, () => {
            this.validateField(eventName, eventValue);
        })
    };

    validateField = (fieldName, value) => {
        // Validate the values entered in the input fields
        // Update the formErrorMessage and formValid objects in the state
        let { formErrorMessage, formValid } = this.state;
        switch (fieldName) {
            case "origin":
                if (value === "") {
                    formErrorMessage["originError"] = "field required";
                    formValid["originfield"] = false;
                } else if (!value.match(/^[a-zA-Z]{1,15}$/)) {
                    formErrorMessage["originError"] = "Please enter a valid origin city";
                    formValid["originfield"] = false;
                } else {
                    formErrorMessage["originError"] = "";
                    formValid["originfield"] = true;
                }
                break;
            case "destination":
                if (value === "") {
                    formErrorMessage["destinationError"] = "field required";
                    formValid["destinationfield"] = false;
                } else if (!value.match(/^[a-zA-Z]{1,15}$/)) {
                    formErrorMessage["destinationError"] = "Please enter a valid destination city";
                    formValid["destinationfield"] = false;
                } else {
                    formErrorMessage["destinationError"] = "";
                    formValid["destinationfield"] = true;
                }
                break;
            case "departureDate":
                if (value === "") {
                    formErrorMessage["departureDateError"] = "field required";
                    formValid["departureDatefield"] = false;
                } else if (new Date().getTime() > new Date(value).getTime()) {
                    formErrorMessage["departureDateError"] = "Departure date cannot be before today";
                    formValid["departureDatefield"] = false;
                } else {
                    formErrorMessage["departureDateError"] = "";
                    formValid["departureDatefield"] = true;
                }
                break;
            case "noOfTickets":
                if (value === "") {
                    formErrorMessage["noOfTicketsError"] = "field required";
                    formValid["noOfTicketsfield"] = false;
                } else if (Number(value) < 1) {
                    formErrorMessage["noOfTicketsError"] = "Number of tickets cannot be less than 1";
                    formValid["noOfTicketsfield"] = false;
                } else if (Number(value) > 5) {
                    formErrorMessage["noOfTicketsError"] = "You can book 5 tickets at a time";
                    formValid["noOfTicketsfield"] = false;
                } else {
                    formErrorMessage["noOfTicketsError"] = "";
                    formValid["noOfTicketsfield"] = true;
                }
                break;
            default:
                break;
        }

        formValid.buttonActive = (formValid.originfield && formValid.destinationfield && formValid.departureDatefield && formValid.noOfTicketsfield);
        this.setState({ formErrorMessage: formErrorMessage, formValid: formValid });
    };
    render() {
        if (this.state.availableFlights != null) {
            // Pass appropriate props to the FlightDetails component below
            return <FlightDetails flightData={this.state.form} availableFlights={this.state.availableFlights} ></FlightDetails>
        } else {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-lg-4 offset-lg-1">
                                <div className="card bg-card text-light ">
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="origin">Origin</label>
                                                <input type="text" className="form-control" name="origin" id="origin" placeholder="Origin" onChange={this.handleChange} />
                                            </div>
                                            <span className="text-danger" >{this.state.formErrorMessage.originError}</span>
                                            <div className="form-group">
                                                <label htmlFor="destination">Destination</label>
                                                <input type="text" className="form-control" name="destination" id="destination" placeholder="Destination" onChange={this.handleChange} />
                                            </div>
                                            <span className="text-danger" >{this.state.formErrorMessage.destinationError}</span>
                                            <div className="form-group">
                                                <label htmlFor="departureDate">Departure Date</label>
                                                <input type="date" className="form-control" name="departureDate" id="departureDate" onChange={this.handleChange} />
                                            </div>
                                            <span className="text-danger" >{this.state.formErrorMessage.departureDateError}</span>
                                            <div className="form-group">
                                                <label htmlFor="noOfTickets">No Of Tickets</label>
                                                <input type="number" className="form-control" name="noOfTickets" id="noOfTickets" placeholder="No Of Tickets" onChange={this.handleChange} />
                                            </div>
                                            <span className="text-danger" >{this.state.formErrorMessage.noOfTicketsError}</span>
                                            <div className="form-group">
                                                <button className="form-control btn btn-primary" type="submit" name="viewFlightButton" disabled={!this.state.formValid.buttonActive} >View Flight</button>
                                            </div>
                                            <span className="text-danger">{this.state.errorMessage}</span>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

}