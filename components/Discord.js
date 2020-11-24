import { Button, Card, Col } from "react-bootstrap";
import Link from "next/link";

function Discord(props) {
    return (
        <Col>
            <Card className="text-center">
                <Card.Header as="h5">Step 2: Link your Discord</Card.Header>
                
                {props.session?.user?.discord ? (
                    <Card.Body>
                        <Card.Text>You are signed in as <span className="font-weight-bold">{props.session.user.netId}</span>.</Card.Text>
                        <Link href="/api/auth/logout" passHref={true}>
                            <Button variant="danger" style={{ width: "90%"}}>Sign out</Button>
                        </Link>
                    </Card.Body>
                ) : (
                    <Card.Body>
                        <Card.Text>Sign in with the Discord account that you would like to use.</Card.Text>
                        {props.session?.uid ? (
                            <Link href="/api/auth/discord" passHref={true}>
                                <Button style={{ width: "90%"}}>Sign in with Discord</Button>
                            </Link>
                        ) : (
                            <>
                                <Card.Text>You must sign in to UCSB before you can proceed to this step.</Card.Text>
                                <Button disabled style={{ width: "90%"}}>Sign in with Discord</Button>
                            </>
                        )}
                    </Card.Body>
                )}
            </Card>
        </Col>
    );
}

export default Discord;
