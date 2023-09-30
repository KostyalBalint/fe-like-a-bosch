import classnames from 'classnames'
import React from 'react'

export function HornIcon({ active }: { active?: boolean }) {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="100.000000pt"
            height="100.000000pt"
            viewBox="0 0 100.000000 100.000000"
            preserveAspectRatio="xMidYMid meet"
            className={classnames('w-12 h-12', active ? 'fill-yellow-600' : 'fill-white')}
        >
            <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" stroke="none">
                <path d="M25 767 c-3 -7 -4 -131 -3 -277 3 -232 5 -265 19 -268 11 -2 19 10 28 39 21 70 106 148 190 174 l24 7 -22 -30 c-11 -17 -21 -41 -21 -55 0 -37 47 -81 115 -107 52 -21 77 -24 185 -24 108 0 133 3 185 24 68 26 115 70 115 106 0 32 -26 71 -59 89 -24 13 -20 14 56 15 72 0 84 -2 97 -21 9 -13 21 -19 30 -16 23 9 23 145 0 154 -9 3 -21 -3 -30 -16 -15 -21 -21 -21 -294 -21 -294 0 -353 6 -430 45 -59 30 -125 102 -141 154 -12 40 -35 54 -44 28z m620 -318 c65 -11 131 -43 149 -71 42 -68 -162 -135 -335 -110 -120 17 -199 68 -173 110 40 63 209 97 359 71z" />
            </g>
        </svg>
    )
}
