import { Alert, Image } from "react-bootstrap";

function Header(props) {
  return (
    <>
        <div className="text-center" style={{ padding: "1.5em"}}>
          <Image src="/cs-logo.png" height="200px" />
          <h1>UCSB CS Open Lab</h1>
          <h5>The perks of CS Open Lab in Phelps 3525 and 3526, now online!</h5>
        </div>
        {props.alert.content ? (
          <Alert variant={props.alert.variant}>{props.alert.content}</Alert>
        ) : 
          <></>
        }
    </>
  );
}

export default Header;