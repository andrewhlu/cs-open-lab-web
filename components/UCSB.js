import { Button, Card, Col } from "react-bootstrap";
import Link from "next/link";

function UCSB(props) {
    return (
        <Col>
            <Card className="text-center">
                <Card.Header as="h5">Step 1: Sign in to UCSB</Card.Header>
                
                {props.session?.uid ? (
                    <Card.Body>
                        <Card.Text>You are signed in as <span className="font-weight-bold">{props.session.user.netId}</span>.</Card.Text>
                        <Link href="/api/auth/logout" passHref={true}>
                            <Button variant="danger" style={{ width: "90%"}}>Sign out</Button>
                        </Link>
                    </Card.Body>
                ) : (
                    <Card.Body>
                        <Card.Text>Sign in with your UCSB NetID.</Card.Text>
                        <Card.Text>This will be used to verify your student status.</Card.Text>
                        <Link href="/api/auth/ucsb" passHref={true}>
                            <Button style={{ width: "90%"}}>Sign in with UCSB SSO</Button>
                        </Link>
                    </Card.Body>
                )}
            </Card>
        </Col>
    );
}

export default UCSB;
