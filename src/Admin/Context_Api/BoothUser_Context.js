import { View, Text } from 'react-native'
import React, { createContext, useState } from 'react'


export const BoothUser_Context = createContext()

export const BoothUser_Provider = ({ children }) => {
    const [boothUserId, setBoothUserId] = useState(null);

    return (
        <BoothUser_Context.Provider value={{ boothUserId, setBoothUserId }}>
            {children}
        </BoothUser_Context.Provider>
    )
}
