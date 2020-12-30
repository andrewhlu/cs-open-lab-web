import { useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { fetch } from "../utils/fetch";

function JoinServer(props) {
    const [user, setUser] = useState({
        fname: props.session?.user?.fname || "",
        lname: props.session?.user?.lname || "",
        pronouns: props.session?.user?.pronouns || ""
    });

    const [customPronounField, setCustomPronounField] = useState(false);

    const defaultPronouns = [
        "he/him",
        "she/her",
        "they/them",
        "ze/hir",
        "ze/zir"
    ]

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
            body: JSON.stringify(user)
        };

        const response = await fetch("/api/discord/join-server", options);
        if (response.success) {
            props.setAlert({
                variant: "success",
                content: `Success! ${user.fname} ${user.lname} has been added to the CS Open Lab Server!`
            });
        } else {
            props.setAlert({
                variant: "danger",
                content: `An error occurred: ${response?.error}`
            });
        }
    }

    const renderNickname = () => {
        return `${user.fname} ${user.lname}${user.pronouns !== "" ? ` (${user.pronouns})` : ""}`.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    }

    if (!customPronounField && user.pronouns !== "" && !defaultPronouns.includes(user.pronouns)) {
        setCustomPronounField(true);
    }

    return (
        <Col>
            <Card className="text-center" style={{ marginBottom: "0.5em" }}>
                <Card.Header as="h5">Step 3: Join the server!</Card.Header>

                <Card.Body>
                    <Card.Text>By joining this server, you agree to the rules posted below and in #rules.</Card.Text>
                    {props.session?.user?.discord ? (
                        <>
                            <Card.Text>Please enter your name and optionally add your pronouns.</Card.Text>
                            <Form onSubmit={handleOnSubmit}>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="First Name" value={user.fname} onChange={e => setUser({ ...user, fname: e.target.value })} required></Form.Control>
                                    <Form.Control type="text" placeholder="Last Name" value={user.lname} onChange={e => setUser({ ...user, lname: e.target.value })} required></Form.Control>
                                    { !customPronounField ? (
                                        <Form.Control as="select" placeholder="Pronouns" value={user.pronouns} onChange={e => setUser({ ...user, pronouns: e.target.value })}>
                                            <option value="">Pronouns (optional)</option>
                                            { defaultPronouns.map(pronoun => <option key={pronoun} value={pronoun}>{pronoun}</option>) }
                                            <option value="other">Other (manual entry)</option>
                                        </Form.Control>
                                    ) : (
                                        <Form.Control type="text" placeholder="Pronouns" value={user.pronouns} onChange={e => setUser({ ...user, pronouns: e.target.value })}></Form.Control>
                                    )} 
                                </Form.Group>
                                { user.fname !== "" && user.lname !== "" && (
                                    <Card.Text>
                                        Your nickname in the server will be changed to "<span className="font-weight-bold">{renderNickname()}</span>"
                                    </Card.Text>
                                )}
                                { renderNickname().length > 32 && (
                                    <Card.Text className="text-danger">Your nickname is over the 32 character limit. Please shorten your nickname.</Card.Text>
                                )}
                                <Button disabled={ user.fname === "" || user.lname === "" || renderNickname().length > 32 } style={{ width: "90%"}} type="submit">Join CS Open Lab!</Button>
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
