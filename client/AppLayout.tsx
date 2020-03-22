import React = require('react')
import { useState, useEffect, useContext } from 'react'
import { Navbar, Container, Nav, Modal, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AppStore } from './AppStore'
import { runInAction } from 'mobx'
import { AppContext } from './context'
import { useObserver } from 'mobx-react'

export const AppLayout = (props: { children: any, noHeader?: boolean }) => {
    const noHeader = props.noHeader || false
    const [showAbout, setShowAbout] = useState(false)

    const { store } = useContext(AppContext)

    useEffect(() => {
        store.loadProgress()
    }, [])

    return useObserver(() => <div className="AppLayout">
        {!noHeader ? <header className="AppHeader">
            <Navbar>
                <Container>
                    <Navbar.Brand href="/home">Sunpeep</Navbar.Brand>
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
        </header> : undefined}
        {props.children}
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
    </div>)
}