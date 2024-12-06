import React, { createContext, useState } from 'react';

export const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [voters, setVoters] = useState([]);

  return (
    <VoterContext.Provider value={{ voters, setVoters }}>
      {children}
    </VoterContext.Provider>
  );
};
