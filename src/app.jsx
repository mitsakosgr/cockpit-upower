import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import cockpit from 'cockpit';
import React from 'react';

let selectedDevice = null;

export class Application extends React.Component {
    constructor() {
        super();

        this.toggleRef = React.createRef();

        this.state = {
            data: null,
            alert: null,
            devices: [],
        };

        cockpit
                .spawn(["upower", "-e"], { err: "message", superuser: "try" })
                .done((response) => {
                    const devices = response.split('\n').filter(i => i);
                    this.setState({ devices });

                    selectedDevice = devices[0];
                })
                .fail((err) => {
                    if (err.message === 'not-found') {
                        err.message = 'Spawning \'upower\' return \'not-found\', make sure upower is installed';
                    }
                    this.setState({ data: null });
                    this.setState({ alert: err });
                    console.log(err);
                });

        this.handleDeviceChange = (event) => {
            selectedDevice = event.target.value;
            this.loadDeviceInfo();
        };
    }

    componentDidMount() {
        const intervalId = setInterval(() => {
            this.loadDeviceInfo();
        }, 10000);
        this.setState({ intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    loadDeviceInfo = () => {
        if (selectedDevice == null) {
            return;
        }

        console.log(selectedDevice);

        cockpit
                .spawn(["upower", "-i", selectedDevice], { err: "message", superuser: "try" })
                .done((response) => {
                    const parts = response.split('Daemon:');
                    // const devices = parts[0].split("Device: ");

                    // this.setState({ devices });

                    const lines = parts[0].split('\n');
                    this.setState({ data: lines });
                    this.setState({ alert: null });
                })
                .fail((err) => {
                    if (err.message === 'not-found') {
                        err.message = 'Spawning \'upower\' return \'not-found\', make sure upower is installed';
                    }
                    this.setState({ data: null });
                    this.setState({ alert: err });
                    console.log(err);
                });
    };

    clearSelection = () => {
        this.setState({
            selected: null,
            isOpen: false
        });
    };

    render() {
        const { devices, data, alert } = this.state;
        return (
            <div>
                <Card style={{ overflow: 'auto' }}>
                    <CardTitle>UPower Output</CardTitle>
                    { alert != null ? <CardBody><Alert variant={alert.variant} title={alert.message} /> </CardBody> : <></> }
                </Card>
                <select onChange={this.handleDeviceChange}>
                    { devices != null
                        ? Object.entries(devices).map((key, index) =>
                            <option key={index} value={key[1]}>{key[1]}</option>
                        )
                        : '' }
                </select>

                <div style={{ overflow: 'auto' }}>
                    { data != null
                        ? Object.entries(data).map((key, index) =>
                            <pre key={index}>
                                {key[1]}
                            </pre>
                        )
                        : '' }
                </div>
            </div>
        );
    }
}
