import { useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { fetch } from "../utils/fetch";
import Link from "next/link";

function JoinServer(props) {
    const [name, setName] = useState({
        fname: props.session?.user?.fname || "",
        lname: props.session?.user?.lname || ""
    });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        props.setAlert({
            variant: "primary",
            content: `Joining CS Open Lab Server...`
        });

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(name)
        };

        const response = await fetch("/api/discord/join-server", options);
        if (response.success) {
            props.setAlert({
                variant: "success",
                content: `Success! ${name.fname} ${name.lname} has been added to the CS Open Lab Server!`
            });
        } else {
            props.setAlert({
                variant: "danger",
                content: `An error occurred: ${response?.error}`
            });
        }
    }

    return (
        <Col>
            <Card className="text-center">
                <Card.Header as="h5">Step 3: Join the server!</Card.Header>

                <Card.Body>
                    <Card.Text>By joining this server, you agree to the rules posted below and in #rules.</Card.Text>
                    {props.session?.user?.discord ? (
                        <>
                            <Card.Text>Your nickname in the server will be changed to your name, as entered below.</Card.Text>
                            <Form onSubmit={handleOnSubmit}>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="First Name" value={name.fname} onChange={e => setName({ ...name, fname: e.target.value })}></Form.Control>
                                    <Form.Control type="text" placeholder="Last Name" value={name.lname} onChange={e => setName({ ...name, lname: e.target.value })}></Form.Control>
                                </Form.Group>
                                <Button disabled={ name.fname === "" || name.lname === "" } style={{ width: "90%"}} type="submit">Join CS Open Lab!</Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Card.Text>You must sign in to UCSB and link your Discord before you can proceed to this step.</Card.Text>
                            <Button disabled style={{ width: "90%"}}>Join CS Open Lab!</Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
}

export default JoinServer;
