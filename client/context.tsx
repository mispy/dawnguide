import { SunpeepApi } from "./SunpeepAPI";
import React = require("react")

export const AppContext: React.Context<{ api: SunpeepApi }> = React.createContext({}) as any