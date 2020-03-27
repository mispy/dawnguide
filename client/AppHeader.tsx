import React = require("react")
import { useContext } from "react"
import { Navbar, Container, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AppContext } from "./AppContext"

export function AppHeader() {
    const { store } = useContext(AppContext)
    return <header className="AppHeader">
        <Navbar>
            <Container>
                <div>
                    <Navbar.Brand as={Link} to="/home">Sunpeep</Navbar.Brand>
                    <span className="environment">alpha</span>
                </div>
                <div className="ml-auto d-flex align-items-center">
                    <Nav className="learnButtons">
                        <ul className="navigation-shortcuts">
                            <li className="navigation-shortcut navigation-shortcut--lessons">
                                <Link to="/lesson">
                                    <span className={store.numLessons === 0 ? 'inactive' : undefined}>{store.numLessons}</span> Lessons
                                </Link>
                            </li>
                            <li className="navigation-shortcut navigation-shortcut--reviews">
                                <Link to="/review">
                                    <span className={store.numReviews === 0 ? 'inactive' : undefined}>{store.numReviews}</span> Reviews
                            </Link>
                            </li>
                        </ul>
                    </Nav>
                    <Nav className="other">
                        <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>

                </div>

            </Container>
        </Navbar>
    </header>
}
