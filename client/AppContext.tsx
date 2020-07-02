import { ClientApi } from "./ClientApi"
import * as React from 'react'
import { AppStore } from "./AppStore"
import { Sunpedia } from "../shared/sunpedia"
import { User } from "../shared/types"
import { CanvasEffects } from "./CanvasEffects"

export const AppContext: React.Context<{ app: AppStore, api: ClientApi, sunpedia: Sunpedia, user: User, effects: CanvasEffects }> = React.createContext({}) as any