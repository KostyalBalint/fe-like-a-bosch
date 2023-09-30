import React, { ReactNode } from 'react'
import classnames from 'classnames'

export function ScenarioTypeIndicator({ children, active }: { children: ReactNode; active: boolean }) {
    return (
        <div
            className={classnames(
                'w-full py-4 text-center border-2 border-gray-800 text-gray-700 tracking-wider font-bold rounded-lg',
                active && 'text-orange-800 border-orange-800 bg-amber-700/10'
            )}
        >
            {children}
        </div>
    )
}
