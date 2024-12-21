import React, { createContext, useState } from 'react'


export const BoothsContext = createContext()

export const BoothsProvider = ({ children }) => {
    const [booths, setBooths] = useState([]);

    return (
        <BoothsContext.Provider value={{ booths, setBooths }}>
            {children}
        </BoothsContext.Provider>
    )
}
