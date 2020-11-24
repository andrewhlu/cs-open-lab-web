import { Container, Row } from "react-bootstrap";
import Header from "./Header";
import UCSB from "./UCSB";
import Discord from "./Discord";
import JoinServer from "./JoinServer";

function Layout(props) {
  return (
    <>
      <Container>
        <Header alert={props.alert}></Header>
        <Row style={{ padding: "0.5em" }}>
          <UCSB session={props.session}></UCSB>
          <Discord session={props.session}></Discord>
          <JoinServer session={props.session}></JoinServer>
        </Row>
        {props.children}
      </Container>
    </>
  );
}

export default Layout;
