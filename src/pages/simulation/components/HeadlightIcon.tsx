import classnames from 'classnames'
import React from 'react'

export function HeadlightIcon({ active }: { active?: boolean }) {
    return (
        <svg
            className={classnames('w-12 h-12', active ? 'fill-blue-700' : 'fill-white')}
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="100.000000pt"
            height="100.000000pt"
            viewBox="0 0 100.000000 100.000000"
            preserveAspectRatio="xMidYMid meet"
        >
            <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" stroke="none">
                <path d="M382 806 c-181 -44 -342 -188 -342 -306 0 -128 183 -278 377 -312 87 -15 114 -5 141 49 55 107 55 419 1 525 -31 60 -69 70 -177 44z" />
                <path d="M632 743 c3 -16 20 -18 166 -21 157 -2 162 -2 162 18 0 19 -6 20 -166 20 -152 0 -165 -1 -162 -17z" />
                <path d="M652 623 c3 -16 20 -18 156 -21 147 -2 152 -2 152 18 0 19 -6 20 -156 20 -143 0 -155 -1 -152 -17z" />
                <path d="M660 500 c0 -19 7 -20 150 -20 143 0 150 1 150 20 0 19 -7 20 -150 20 -143 0 -150 -1 -150 -20z" />
                <path d="M657 393 c-4 -3 -7 -12 -7 -20 0 -10 33 -13 155 -13 148 0 155 1 155 20 0 19 -7 20 -148 20 -82 0 -152 -3 -155 -7z" />
                <path d="M637 273 c-4 -3 -7 -12 -7 -20 0 -10 34 -13 165 -13 158 0 165 1 165 20 0 19 -7 20 -158 20 -87 0 -162 -3 -165 -7z" />
            </g>
        </svg>
    )
}
