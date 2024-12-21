import React, { createContext, useState } from 'react';

export const TotalVoterContext = createContext();

export const TotalVoterProvider = ({ children }) => {
    const [totalVoters, setTotalVoters] = useState([]);

    return (
        <TotalVoterContext.Provider value={{ totalVoters, setTotalVoters }}>
            {children}
        </TotalVoterContext.Provider>
    );
};

export default TotalVoterContext;
