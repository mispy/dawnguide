import { DawnguideApi } from "./DawnguideApi"
import React = require("react")
import { AppStore } from "./AppStore"
import { Sunpedia } from "../shared/sunpedia"
import { User } from "../shared/types"

export const AppContext: React.Context<{ app: AppStore, api: DawnguideApi, sunpedia: Sunpedia, user: User }> = React.createContext({}) as any