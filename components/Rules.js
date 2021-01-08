import { Card, Col } from "react-bootstrap";
import marked from "marked";

function Rules(props) {
    return (
        <Col>
            <Card className="text-center" style={{ marginBottom: "0.5em" }}>
                <Card.Header as="h5">CS Open Lab Rules</Card.Header>
                <div 
                    dangerouslySetInnerHTML={{ __html: marked(props.rules) }}
                    style={{ textAlign: "left", padding: "1.5em"}}></div>
            </Card>
        </Col>
    );
}

export default Rules;
