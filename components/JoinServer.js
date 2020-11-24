import { Button, Card, Col, Form } from "react-bootstrap";
import Link from "next/link";

function JoinServer(props) {
    return (
        <Col>
            <Card className="text-center">
                <Card.Header as="h5">Step 3: Join the server!</Card.Header>

                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type="text" placeholder="First Name" value={props.session?.user?.fname}></Form.Control>
                            <Form.Control type="text" placeholder="Last Name" value={props.session?.user?.lname}></Form.Control>
                        </Form.Group>
                    </Form>
                    <Card.Text>By joining this server, you agree to the rules posted below and in #rules.</Card.Text>
                
                    {props.session?.user?.discord ? (
                        <Link href="" passHref={true}>
                            <Button style={{ width: "90%"}}>Join CS Open Lab!</Button>
                        </Link>
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
