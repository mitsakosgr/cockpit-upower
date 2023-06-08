/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import cockpit from 'cockpit';
import React from 'react';

export class Application extends React.Component {
    constructor() {
        super();
        this.state = { data: null, alert: null };
    }

    componentDidMount() {
        const intervalId = setInterval(() => {
            this.loadSensors();
        }, 10000);
        this.loadSensors();
        this.setState({ intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    loadSensors = () => {
        cockpit
                .spawn(["upower", "-d"], { err: "message", superuser: "try" })
                .done((response) => {
                    const lines = response.split('\n');
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

    render() {
        const { data, alert } = this.state;
        return (
            <Card>
                <CardTitle>UPower Output</CardTitle>
                <CardBody>
                    { alert != null ? <Alert variant={alert.variant} title={alert.message} /> : <></> }
                    { data != null
                        ? Object.entries(data).map((key, index) =>
                            <pre key={index}>
                                {key[1]}
                            </pre>
                        )
                        : '' }
                </CardBody>
            </Card>
        );
    }
}
