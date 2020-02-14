import { SunpeepApi } from "./SunpeepApi"
import React = require("react")
import { AppStore } from "./AppStore"

export const AppContext: React.Context<{ api: SunpeepApi, store: AppStore }> = React.createContext({}) as any