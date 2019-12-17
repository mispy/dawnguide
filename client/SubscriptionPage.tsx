import React = require("react")
import { observer } from "mobx-react"
import { observable, action, computed } from "mobx"
import { AppLayout } from "./AppLayout"

export const SubscriptionPage = () => {
    return <AppLayout>
        <div>
            Subscription page!
        </div>
    </AppLayout>
}