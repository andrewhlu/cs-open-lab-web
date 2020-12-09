import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Header from "./Header";
import UCSB from "./UCSB";
import Discord from "./Discord";
import JoinServer from "./JoinServer";

function Layout(props) {
  const [alert, setAlert] = useState({
    variant: props.alert ? "danger" : "",
    content: props.alert
  });

  return (
    <>
      <Container>
        <Header alert={alert}></Header>
        <Row xs={1} lg={3} style={{ padding: "0.5em" }}>
          <UCSB session={props.session}></UCSB>
          <Discord session={props.session}></Discord>
          <JoinServer session={props.session} setAlert={setAlert}></JoinServer>
        </Row>
        {props.children}
      </Container>
    </>
  );
}

export default Layout;
