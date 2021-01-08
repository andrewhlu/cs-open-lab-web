import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Header from "./Header";
import UCSB from "./UCSB";
import Discord from "./Discord";
import JoinServer from "./JoinServer";
import Rules from "./Rules";

function Layout(props) {
  const [alert, setAlert] = useState({
    variant: props.alert ? "danger" : "",
    content: props.alert
  });

  return (
    <Container>
      <Header alert={alert} />
      <Row xs={1} lg={3} style={{ padding: "0.5em" }}>
        <UCSB session={props.session} />
        <Discord session={props.session} />
        <JoinServer session={props.session} setAlert={setAlert} />
      </Row>
      <Rules rules={props.rules}/>
      {props.children}
    </Container>
  );
}

export default Layout;
