import { SunpeepApi } from "./SunpeepApi"
import React = require("react")
import { AppStore } from "./AppStore"
import { Sunpedia } from "../shared/sunpedia"

export const AppContext: React.Context<{ store: AppStore, api: SunpeepApi, sunpedia: Sunpedia }> = React.createContext({}) as any