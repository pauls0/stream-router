import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";

const MenuBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div class="mx-2">
      <Navbar color="light" light expand="md">
        <Link class="navbar-brand" to="/">
          <img
            src="https://www.svgrepo.com/show/216785/home-house.svg"
            width="30"
            height="30"
            class="d-inline-block align-top mx-2"
            alt="house"
          />
          Angus Brooks Consulting
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link class="nav-link" to="/about">
                {" "}
                About
              </Link>{" "}
            </NavItem>
            <NavItem>
              <Link class="nav-link" to="/products">
                {" "}
                Products
              </Link>{" "}
            </NavItem>
            <NavItem>
              <Link class="nav-link" to="/blog">
                {" "}
                Blog
              </Link>{" "}
            </NavItem>
            <NavItem>
              <Link class="nav-link" to="/contact">
                {" "}
                Contact
              </Link>{" "}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

function Navigation(props) {
  return <MenuBar />;
}

export default withRouter(Navigation);
