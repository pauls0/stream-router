import "./App.css";
import React, { useState } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Container,
  CardLink,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Row,
  Col,
} from "reactstrap";

import Footer from "./Footer";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <div class="mx-4">
          <NavbarBrand href="/">stream-router-admin-console</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar></Collapse>
      </Navbar>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Example></Example>
      <Container className="mt-5 center">
        <Row className="center">
        <Col class="center">
        
  
          <Card className="align-items-center">
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="exampleEmail" className="mr-sm-2">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="something@idk.cool"
                />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="examplePassword" className="mr-sm-2">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="don't tell!"
                />
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </Card>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </div>
  );
}

export default App;
