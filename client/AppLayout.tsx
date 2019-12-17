import { observer } from "mobx-react"
import React = require("react")
import { Navbar, Container, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

@observer
export class AppLayout extends React.Component {
    render() {
        return <>
            <header className="AppHeader">
                <Navbar>
                    <Container>
                        <Navbar.Brand href="/home">Sunpeep</Navbar.Brand>
                        <Nav className="learnButtons">
                            <ul className="navigation-shortcuts">
                                <li className="navigation-shortcut navigation-shortcut--lessons">
                                    <Link to="/lesson">
                                        <span>49</span> Lessons
                                    </Link>
                                </li>
                                <li className="navigation-shortcut navigation-shortcut--reviews">
                                    <Link to="/review">
                                        <span>194</span> Reviews
                                    </Link>
                                </li>
                            </ul>
                        </Nav>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                <Nav.Link href="/logout">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <main className="container">
                {this.props.children}
            </main>
        </>
    }
}