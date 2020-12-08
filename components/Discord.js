import { Button, Card, Col, Image } from "react-bootstrap";
import Link from "next/link";

function Discord(props) {
    const getImageUrl = (discord) => {
        if (discord?.user?.avatar === null) {
            return `https://cdn.discordapp.com/embed/avatars/${discord?.user?.discriminator % 5}.png?size=64`
        } else {
            return `https://cdn.discordapp.com/avatars/${discord?.user?.id}/${discord?.user?.avatar}.png?size=64`;
        }
    }

    return (
        <Col>
            <Card className="text-center">
                <Card.Header as="h5">Step 2: Link your Discord</Card.Header>
                
                {props.session?.user?.discord ? (
                    <Card.Body>
                        <Image src={getImageUrl(props.session.user.discord)} roundedCircle style={{ margin: "10px", height: "64px" }} />
                        <Card.Text>
                            You are signed in as <span className="font-weight-bold">{props.session.user.discord.user.username}</span>#{props.session.user.discord.user.discriminator}.
                        </Card.Text>
                        <Button disabled variant="danger" style={{ width: "90%"}}>Unlink Discord</Button>
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
