import { Walktour } from 'walktour'
import { Typography } from '@mui/material'
import { WalktourFooter } from './WalktourFooter'
import React from 'react'

export function Tutorial({ onDone }: { onDone: () => void }) {
    if (window.innerWidth < 500) return null
    return (
        <Walktour
            disableClose
            allowForeignTarget={false}
            customTitleRenderer={(title) => (
                <Typography variant="h5" fontWeight="bold">
                    {title}
                </Typography>
            )}
            customFooterRenderer={(tourLogic) => (
                <WalktourFooter
                    tourLogic={tourLogic}
                    onSkip={() => {
                        tourLogic?.close()
                        localStorage.setItem('tutorial', 'true')
                        onDone()
                    }}
                    onNext={() => tourLogic?.next()}
                />
            )}
            steps={[
                {
                    selector: '#simulation',
                    title: 'Welcome to CrashCraft!',
                    description: 'This is a demo of our solution for the Bosch Code #LikeABosch software challenge',
                },
                {
                    selector: '#simulation',
                    title: 'The meaning of the colors',
                    description:
                        'The objects are colored according to their type. The colors are as follows: objects are gray, tracked objects are blue. The intersection point is green and the object we are colliding with is red.',
                },
                {
                    selector: '#playback-control',
                    title: 'Playback control',
                    description: 'You can control the simulation here',
                },
                {
                    selector: '#speed-selector',
                    title: 'Select the simulation speed',
                    description:
                        'You can change the simulation speed with this dropdown. 1x means 1 second in the simulation is 1 second in real time',
                },
                {
                    selector: '#play-button',
                    title: 'Start the simulation',
                    description: 'You can start the simulation with this button',
                },
                {
                    selector: '#timeline',
                    title: 'Timeline',
                    description: 'You can use this slider to jump to a specific point in the simulation',
                },
                {
                    selector: '#change-dataset',
                    title: 'Change the dataset',
                    description: 'You can change the dataset with this button',
                },
                {
                    selector: '#toggle-intersection',
                    title: 'Toggle intersection visibility',
                    description: 'You can toggle the intersection visibility with this button. The intersections are marked with a green object',
                },
                {
                    selector: '#toggle-prediction',
                    title: 'Toggle prediction visibility',
                    description: 'You can toggle the prediction visibility with this button. The predictions are marked with a blue path',
                },
                {
                    selector: '#toggle-brake',
                    title: 'Toggle brake distance visibility',
                    description: 'You can toggle the brake distance visibility with this button. The brake distances are marked with a pink path',
                },
                {
                    selector: '#vehicle-status',
                    title: 'Vehicle status',
                    description: 'You can see the speed of the vehicle and the status of the equipments here',
                },
                {
                    selector: '#deceleration-needed',
                    title: 'Deceleration needed',
                    description: 'You can see the deceleration needed to avoid the collision here',
                },
                {
                    selector: '#scenario-types',
                    title: 'Scenario types',
                    description: 'You can see the scenario types here. When a scenario is detected, it is shown in orange',
                },
                {
                    selector: '#object-info',
                    title: 'Object info',
                    description: 'You can see the positions and speeds of the objects here',
                    closeLabel: 'Okay, got it',
                },
            ]}
        />
    )
}
