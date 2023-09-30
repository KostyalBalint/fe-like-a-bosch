import React, { createContext, useContext, useState } from 'react'

interface SelectedObjectContextProps {
    selectedObject: null | number
    setSelectedObject: (value: null | number) => void
}

const SelectedObjectContext = createContext<SelectedObjectContextProps>({
    selectedObject: null,
    setSelectedObject: () => {},
})

export const SelectedObjectContextProvider = (props: React.PropsWithChildren) => {
    // Manage your state here
    const [selectedObject, setSelectedObject] = useState<null | number>(null)

    return (
        // Step 3: Provide the state and functions through the context
        <SelectedObjectContext.Provider value={{ selectedObject, setSelectedObject }}>{props.children}</SelectedObjectContext.Provider>
    )
}

export const useSelectedObject = () => {
    const context = useContext(SelectedObjectContext)

    if (!context) {
        throw new Error('useSelectedObject must be used within a SelectedObjectContext')
    }

    return context
}
