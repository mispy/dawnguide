import React = require("react")
import { Navbar, Container, Nav } from "react-bootstrap"

export function SiteHeader() {
    return <header className="SiteHeader">
        <Navbar>
            <Container>
                <div>
                    <Navbar.Brand href="/">Sunpeep</Navbar.Brand>
                    <span className="environment">alpha</span>
                </div>
                <div className="ml-auto d-flex align-items-center">

                    <Nav className="other">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Sign up</Nav.Link>
                    </Nav>

                </div>

            </Container>
        </Navbar>
    </header>
}
