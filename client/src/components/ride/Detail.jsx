import React from 'react';
import { Link } from 'react-router-dom';

import TaskPanel from '../shared/TaskPanel';
import { states } from '../../utils/states';
import { baseUrl } from '../../utils/service';

class RideDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            quantity: 0,
            isError: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchRide = this.fetchRide.bind(this);
        this.updateRide = this.updateRide.bind(this);
        this.finishRide = this.finishRide.bind(this);
        this.rejectRide = this.rejectRide.bind(this);
    }

    handleChange(e) {
        e.preventDefault();

        let value = {};
        value[e.target.id] = e.target.value;

        this.setState(value);
    }

    async fetchRide() {
        const id = this.props.match.params.id;

        try {
            const url = `${baseUrl}rides/${id}`
            const response = await fetch(url);
            const result = await response.json();

            const { consumer, state, date, quantity, notes } = result

            this.setState({
                consumer,
                date,
                state,
                notes
            });

        } catch {
            this.setState({
                isError: true
            });
        }
    }

    async updateRide() {
        const id = this.props.match.params.id;
        const ride = this.state;

        try {
            const url = `${baseUrl}rides/${id}`;
            await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ride)
            });

            this.props.history.push(`/fahrten`);

        } catch {
            this.setState({
                isError: true
            });
        }
    }

    finishRide() {
        this.setState({
            state: 1
        }, () => {
            this.updateRide()
        });
    }

    rejectRide() {
        this.setState({
            state: 2
        }, () => {
            this.updateRide()
        });
    }

    componentDidMount() {
        this.fetchRide();
    }

    render() {
        const state = this.state;
        const consumer = state.consumer;

        if (!consumer) {
            return "No Consumer"
        }

        const date = new Date(state.date);

        return (
            <div className="container">
                <div className="pc-2 mt-4 mb-4 border-bottom">
                    <h1>Abholdetails</h1>
                </div>

                <TaskPanel>
                    <button
                        className="btn btn-primary mr-1"
                        data-toggle="collapse"
                        data-target="#pickup-form"
                        aria-expanded="false"
                    >
                        Erledigt
                    </button>
                    <button
                        className="btn btn-primary mr-1"
                        onClick={this.rejectRide}
                    >
                        Ablehen
                    </button>
                    <button className="btn btn-primary mr-1">Delegieren</button>
                    <Link
                        to="/fahrten"
                        className="btn btn-primary mr-1"
                    >
                        Zurück
                    </Link>
                </TaskPanel>

                <div className="collapse" id="pickup-form">
                    <div className="card mb-3">
                        <div className='card-header'>Abholung bestätigen</div>
                        <div className="card-body">
                            <form>
                                <div className="form-group col-md-2">
                                    <label htmlFor="quantity">Menge</label>
                                    <input
                                        className="form-control"
                                        id="quantity"
                                        type="number"
                                        min={0}
                                        max={consumer.pitSize}
                                        value={state.quantity}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.finishRide()}
                                >
                                    Bestätigen
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h5 className="card-header">{date.toString()}</h5>
                    <div className="card-body">

                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label htmlFor="customerNumber">Kundennummer</label>
                                <input
                                    className="form-control"
                                    id="customerNumber"
                                    type="text"
                                    value={consumer.customerNumber}
                                    disabled
                                />
                            </div>
                            {consumer.company &&
                                <div className="form-group col-md-8">
                                    <label htmlFor="company">Firma</label>
                                    <input
                                        className="form-control"
                                        id="company"
                                        type="text"
                                        value={consumer.company}
                                        disabled
                                    />
                                </div>
                            }
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nameFirst">Name</label>
                                <input
                                    className="form-control"
                                    id="nameFirst"
                                    type="text"
                                    value={consumer.name.first + " " + consumer.name.last}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="street">Straße</label>
                                <input
                                    className="form-control"
                                    id="street"
                                    type="text"
                                    value={consumer.adress.street + " " + consumer.adress.number}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label htmlFor="zipcode">Ort</label>
                                <input
                                    className="form-control"
                                    id="zipcode"
                                    type="text"
                                    value={consumer.adress.zipcode + " " + consumer.adress.city}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="tavArea">TAV</label>
                                <input
                                    className="form-control"
                                    id="tavArea"
                                    type="text"
                                    value={consumer.tavArea}
                                    disabled
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="pitSize">Grubengröße in m³</label>
                                <input
                                    className="form-control"
                                    id="pitSize"
                                    type="text"
                                    value={consumer.pitSize}
                                    disabled
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="interval">Interval in Wochen</label>
                                <input
                                    className="form-control"
                                    id="interval"
                                    type="text"
                                    value={consumer.interval}
                                    disabled
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="interval">Status</label>
                                <input
                                    className="form-control"
                                    id="interval"
                                    type="text"
                                    value={states[state.state]}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label htmlFor="notes">Bemerkungen</label>
                                <textarea
                                    className="form-control"
                                    id="notes"
                                    type="text"
                                    rows="4"
                                    value={state.notes}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RideDetails;