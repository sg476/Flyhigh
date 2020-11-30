import React, { Component } from "react";
import axios from "axios";
import GetFlights from './GetFlights';
//import BookingDetailsCard from './BookingDetailsCard';

const url = "http://localhost:1050/bookFlight/";

class CreateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetails: this.props.bookingDetails,
      passengerData: [],
      form: {
        firstName: "",
        lastName: "",
        title: "",
        age: ""
      },
      formErrorMessage: {
        firstNameError: "",
        lastNameError: "",
        ageError: ""
      },
      formValid: {
        firstName: false,
        lastName: false,
        age: false,
        buttonActive: false
      },
      errorMessage: "",
      successMessage: "",
      goBack: false,

    };
  }

  book = () => {
    let bookingData = this.state.bookingDetails;
    bookingData.passengerDetails = this.state.passengerData;
    // Make axios post request to post the bookingData to the given URL
    // populate the successMessage object or the errorMessage
    console.log("Hello from Book");
    
    axios.post(url, bookingData)
      .then((response) => {
        this.setState({ successMessage: response.data.bookingId })
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

  handleChange = event => {
    // Get the names and values of the input fields
    // Update the formValue object in state
    // Call the validateField method by passing the name and value of the input field
    let { form } = this.state;
    let eventName = event.target.name;
    let eventValue = event.target.value;
    form[eventName] = eventValue;
    this.setState({ form: form })
    this.validateField(eventName, eventValue);

  };

  validateField = (fieldName, value) => {
    // Validate the values entered in the input fields
    // Update the formErrorMessage and formValid objects in the state
    let { formErrorMessage, formValid } = this.state;
    switch (fieldName) {
      case "firstName":
        if (value === "") {
          formErrorMessage["firstNameError"] = "field required";
          formValid["firstName"] = false;
        } else if (!value.match(/^[a-zA-Z]{1,15}$/)) {
          formErrorMessage["firstNameError"] = "Please enter a valid first name";
          formValid["firstName"] = false;
        } else {
          formErrorMessage["firstNameError"] = "";
          formValid["firstName"] = true;
        }
        break;
      case "lastName":
        if (value === "") {
          formErrorMessage["lastNameError"] = "field required";
          formValid["lastName"] = false;
        } else if (!value.match(/^[a-zA-Z]{1,15}$/)) {
          formErrorMessage["lastNameError"] = "Please enter a valid last name";
          formValid["lastName"] = false;
        } else {
          formErrorMessage["lastNameError"] = "";
          formValid["lastName"] = true;
        }
        break;
      case "age":
        if (value === "") {
          formErrorMessage["ageError"] = "field required";
          formValid["age"] = false;
        } else if (value < 1 || value > 70) {
          formErrorMessage["ageError"] = "Sorry, age should be more than 1 year and less than 70 years";
          formValid["age"] = false;
        } else {
          formErrorMessage["ageError"] = "";
          formValid["age"] = true;
        }
        break;
      default:
        break;
    }
    formValid.buttonActive = formValid.firstName && formValid.lastName && formValid.age;
    this.setState({ formErrorMessage: formErrorMessage, formValid: formValid });
  };
  setPassengerData = () => {
    // Update the passengerData array in state
    // reset the form and the formValid object in state
    let { passengerData } = this.state;
    passengerData.push(this.state.form);
    let form = { firstName: "", lastName: "", title: "", age: "" };
    let formValid = { firstName: false, lastName: false, age: false, buttonActive: false }
    this.setState({ passengerData: passengerData, form: form, formValid: formValid })
  }
  getPassengerData = () => {
    if (this.state.passengerData.length < Number(this.state.bookingDetails.noOfTickets)) {
      return (
        <React.Fragment>
          <div className="card bg-card text-light mb-4">
            <div className="card-body">
              <h6>Passenger {this.state.passengerData.length + 1}</h6>
              <div className="row">
                {/* Add name, value, placeholder attributes to the below select dropdown, inputs and button */}
                {/* Also add appropriate event handlers */}
                <div className="col-md-8">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <select className="btn btn-light" name="title" onChange={this.handleChange}>
                        <option value="" selected disabled>Title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                    </div>
                    <input type="text" className="form-control" name="firstName" placeholder="First Name" onChange={this.handleChange} value={this.state.form.firstName} />
                    <input type="text" className="form-control" name="lastName" placeholder="Last Name" onChange={this.handleChange} value={this.state.form.lastName} />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <input type="number" className="form-control" name="age" onChange={this.handleChange} value={this.state.form.age} />
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <button className="btn btn-primary font-weight-bolder" disabled={!this.state.formValid.buttonActive} onClick={this.setPassengerData} >Add</button>
                </div>
              </div>
              <div className="text-danger">
                {/* Display the formErrorMessages here */}
                <span>{this.state.formErrorMessage.firstNameError}</span><br />
                <span>{this.state.formErrorMessage.lastNameError}</span><br />
                <span>{this.state.formErrorMessage.ageError}</span><br />
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
  displayBookingSuccess = () => {
    return (
      <React.Fragment>
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="card bg-card custom-card text-light">
                <div className="card-body">

                  {/* Add the booking ID to the below heading, from the successMessage object */}
                  <h4 className="text-success">Booking successful with booking ID: {this.state.successMessage}</h4>
                  {/* Display the booking details here by rendering the BookingDetailsCard component and passing successMessage as props*/}
                  <div className="col-lg-12">
                    <div className="text-custom">Flight Id</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.flightId}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Timing</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.timing}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Departure Date</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.departureDate}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Origin - Destination</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.origin} - {this.state.bookingDetails.destination}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Passengers</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.noOfTickets} Adult(s)</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Total Fare</div>
                    <h4 style={{ paddingLeft: "15px" }}>₹ {this.state.bookingDetails.charges}</h4>
                  </div>
                </div>
                <div className="card-footer">
                  {/* Add the Home button here */}
                  <button className="btn btn-warning col-lg-12" name="goBack" onClick={() => { this.setState({ goBack: true })}}>Home</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
  render() {
    if (this.state.goBack) {
      // Display the GetFlights page by rendering the GetFlights component
      return <GetFlights />
    }
    if (this.state.successMessage === "") {
      return (
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-7">
              {
                this.state.passengerData.length > 0 ? (
                  this.state.passengerData.map((passenger, index) => {
                    return (
                      <div className="card bg-card text-light mb-4" key={index}>
                        <div className="card-body">
                          <div className="text-custom">Passenger {index + 1}</div>
                          <h4>{passenger.title} {passenger.firstName} {passenger.lastName}, {passenger.age}</h4>
                        </div>
                      </div>
                    )
                  })
                ) : null
              }
              {this.getPassengerData()}
            </div>
            <div className="col-lg-4 offset-lg-1">
              <div name="flightDetails" className="card bg-card text-light">
                <div className="card-body">
                  {/* Display the booking details here by rendering the BookingDetailsCard component and passing bookingDetails in state as props*/}
                  <div className="col-lg-12">
                    <div className="text-custom">Flight Id</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.flightId}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Timing</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.timing}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Departure Date</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.departureDate}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Origin - Destination</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.origin} - {this.state.bookingDetails.destination}</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Passengers</div>
                    <h4 style={{ paddingLeft: "15px" }}>{this.state.bookingDetails.noOfTickets} Adult(s)</h4>
                  </div>
                  <div className="col-lg-12">
                    <div className="text-custom">Total Fare</div>
                    <h4 style={{ paddingLeft: "15px" }}>₹ {this.state.bookingDetails.charges}</h4>
                  </div>
                </div>
                <div className="card-footer">
                  {/* Add the book, home buttons here and display axios error messages here */}
                  <button className="btn btn-primary col-lg-12" name="bookButton" onClick={this.book} disabled={!(this.state.passengerData.length === Number(this.state.bookingDetails.noOfTickets))}>Book</button><br />
                  <button className="btn btn-warning col-lg-12" name="goBack" onClick={() => { this.setState({ goBack: true }) }} style={{ marginTop: "10px" }}>Home</button>
                  <span className="text-danger">{this.state.errorMessage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return this.displayBookingSuccess();
    }
  }
}

export default CreateBooking;
