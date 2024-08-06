import React, { useEffect, useRef, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, styled } from '@mui/material';
var data = require("../../../Misc/dates_and_runs.json");


const CustomStepLabel = styled(StepLabel)(({ active }) => ({
    '& .MuiStepLabel-label': {
        color: active ? 'blue' : 'grey', 
    },
    '& .MuiStepIcon-root': {
        color: active ? 'blue' : 'grey', 
    },
}));

function HorizontalTimeline({ privtypes, activeIndex, updateParent, handleClick }: { privtypes: any, activeIndex: any, updateParent: any, handleClick: any }) {
    const [activeStep, setActiveStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const runRefs = useRef<any[]>([]);
    const [dateMapping, setDateMapping] = useState(JSON.parse(JSON.stringify(data)));

    useEffect(() => {
        runRefs.current = privtypes.map((_: any, i: any) => runRefs.current[i] = React.createRef());
    }, [privtypes]);

    const scrollToStep = (stepIndex: number) => {
        if (runRefs.current[stepIndex] && runRefs.current[stepIndex].current) {
            runRefs.current[stepIndex].current.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest'
            });
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = prevActiveStep + 1;
            scrollToStep(nextStep);
            updateParent(nextStep);
            return nextStep;
        });
    };

    const handleSkip = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = privtypes.length - 1;
            scrollToStep(privtypes.length - 1);
            updateParent(nextStep);
            return nextStep;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const prevStep = prevActiveStep - 1;
            scrollToStep(prevStep);
            updateParent(prevStep);
            return prevStep;
        });
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or some placeholder content for SSR
    }

    return (
        <div className="w-full">
            <Stepper className="overflow-x-scroll scrollbar-hide" activeStep={activeStep}>
                {privtypes.map((data: any, index: number) => (
                    <Step ref={runRefs.current[index]} key={index}>
                        <CustomStepLabel
                            onClick={() => handleClick(data, index)}
                            active={index === activeStep}
                        >
                            {dateMapping.find((obj: any) => obj.run_number === data.index)?.date}
                        </CustomStepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2}}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'black', color: 'white' } }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={activeStep === privtypes.length - 1}
                        sx={{ mr: 1, backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'black', color: 'white' } }}
                    >
                        Next
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button
                        onClick={handleSkip}
                        disabled={activeStep === privtypes.length - 1}
                        sx={{ mr: 1, backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'black', color: 'white' } }}
                    >
                        Skip to End
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default HorizontalTimeline;
