import React = require('react')
import { useState } from 'react'
import { Navbar, Container, Nav, Modal, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export const AppLayout = (props: { numLessons?: number, numReviews?: number, children: any }) => {
    const [showAbout, setShowAbout] = useState(false)

    return <div className="AppLayout">
        <header className="AppHeader">
            <Navbar>
                <Container>
                    <Navbar.Brand href="/home">Sunpeep</Navbar.Brand>
                    <Nav className="learnButtons">
                        <ul className="navigation-shortcuts">
                            <li className="navigation-shortcut navigation-shortcut--lessons">
                                <Link to="/lesson">
                                    <span className={props.numLessons === 0 ? 'inactive' : undefined}>{props.numLessons}</span> Lessons
                                    </Link>
                            </li>
                            <li className="navigation-shortcut navigation-shortcut--reviews">
                                <Link to="/review">
                                    <span className={props.numReviews === 0 ? 'inactive' : undefined}>{props.numReviews}</span> Reviews
                                </Link>
                            </li>
                        </ul>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Nav onClick={() => setShowAbout(true)}>
                            <Nav.Link>About</Nav.Link>
                        </Nav> */}
                        <Nav>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        <Container>
            {props.children}
        </Container>
        <Modal show={showAbout} onHide={() => setShowAbout(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAbout(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => setShowAbout(false)}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </div >
}