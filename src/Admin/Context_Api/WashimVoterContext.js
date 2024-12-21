import React, { createContext, useState } from 'react';

export const WashimVoterContext = createContext();

export const WashimVoterProvider = ({ children }) => {
    const [washimVoters, setWashimVoters] = useState([]);
    const [wshmVtrCount, setWshmVtrCount] = useState('0000');
    return (
        <WashimVoterContext.Provider value={{ washimVoters, setWashimVoters, wshmVtrCount, setWshmVtrCount }}>
            {children}
        </WashimVoterContext.Provider>
    );
};

export default WashimVoterContext;
