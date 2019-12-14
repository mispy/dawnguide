import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import * as _ from 'lodash'

import './index.scss'
import { Navbar, Nav, Container } from 'react-bootstrap'

@observer
class Main extends React.Component {
    render() {
        return <main>
            <header className="SiteHeader">
                <Navbar>
                    <Container>
                        <Navbar.Brand href="#home">Sunpeep</Navbar.Brand>
                        <Nav className="learnButtons">
                            <ul className="navigation-shortcuts">
                                <li className="navigation-shortcut navigation-shortcut--lessons">
                                    <a href="/lesson">
                                        <span>49</span> Lessons
                                    </a>
                                </li>
                                <li className="navigation-shortcut navigation-shortcut--reviews">
                                    <a href="/review">
                                        <span>194</span> Reviews
                                    </a>
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
            <div style={{ marginTop: "8rem", textAlign: "center" }}>
                Nothing much here yet 😝
            </div>
        </main>
    }
}

ReactDOM.render(<Main />, document.getElementById("root"))