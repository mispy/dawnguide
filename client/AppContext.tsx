import { DawnguideApi } from "./DawnguideApi"
import React = require("react")
import { AppStore } from "./AppStore"
import { Sunpedia } from "../shared/sunpedia"

export const AppContext: React.Context<{ app: AppStore, api: DawnguideApi, sunpedia: Sunpedia }> = React.createContext({}) as any