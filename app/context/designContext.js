// DesignContext.js
import React, { createContext, useState, useContext } from 'react';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [selectedMaskId, setSelectedMaskId] = useState(null);
  
  const isMaskLocked = (maskId) => {
    return selectedDesignId !== null && selectedMaskId === maskId;
  };

  const selectDesign = (designId, maskId) => {
    setSelectedDesignId(designId);
    setSelectedMaskId(maskId);
  };

  const deselectDesign = () => {
    setSelectedDesignId(null);
    setSelectedMaskId(null);
  };

  return (
    <DesignContext.Provider value={{
      selectedDesignId,
      selectedMaskId,
      selectDesign,
      deselectDesign,
      isMaskLocked,
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => useContext(DesignContext);