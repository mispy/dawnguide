import React = require("react")
import { Navbar, Container, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { observer } from "mobx-react"
import { AppLayout } from "./AppLayout"

@observer
export class HomePage extends React.Component {
    render() {
        return <AppLayout>
            <div style={{ marginTop: "8rem", textAlign: "center" }}>
                Homepage! Nothing much here yet 😝
            </div>
        </AppLayout>
    }
}