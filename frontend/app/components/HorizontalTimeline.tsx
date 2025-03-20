import React, { useEffect, useRef, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, styled } from '@mui/material';

var data = require("../../../backend/Misc/dates_and_runs.json");

const CustomStepLabel = styled(StepLabel)(({ active }) => ({
    '& .MuiStepLabel-label': {
        color: active ? 'blue' : 'grey', 
    },
    '& .MuiStepIcon-root': {
        color: active ? 'blue' : 'grey', 
    },
}));

function deepEqual(obj1: any, obj2: any): boolean {
    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }

        // Sort objects in arrays by a stable key (if available)
        const sorted1 = obj1
            .map((item) => JSON.stringify(item)) // Convert to string for comparison
            .sort();
        const sorted2 = obj2
            .map((item) => JSON.stringify(item))
            .sort();

        return sorted1.every((item, index) => deepEqual(JSON.parse(item), JSON.parse(sorted2[index])));
    }

    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (!deepEqual(keys1, keys2)) {
        return false;
    }

    return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
}

function equal(obj1: any, obj2: any): boolean {
    return deepEqual(obj1?.privacyDetails, obj2?.privacyDetails);
}

function findChanges(runs: any){
    let arr = []
    arr.push(runs[0])

    for(let i=0; i<runs.length-1; i++){
        const currentRun = runs[i];
        const nextRun = runs[i + 1];
        if (!equal(currentRun.privacy_types, nextRun.privacy_types)) {
            arr.push(nextRun)
        }
    }
    arr.push(runs[runs.length-1])
    return arr
}

function HorizontalTimeline({ privtypes, activeIndex, updateParent, handleClick }: { privtypes: any, activeIndex: any, updateParent: any, handleClick: any }) {
    const [activeStep, setActiveStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const runRefs = useRef<any[]>([]);
    const [dateMapping, setDateMapping] = useState(JSON.parse(JSON.stringify(data)));
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    let arrRuns = findChanges(privtypes);
  
    const skippedRuns = arrRuns.map((run, index) => {
        if (index === 0) return 0; // No previous run to compare
        const currentRunNumber = privtypes.findIndex(obj => obj.index === run.index);
        const previousRunNumber = privtypes.findIndex(obj => obj.index === arrRuns[index - 1].index);
        return currentRunNumber - previousRunNumber - 1;
    });

    const indexMapping = arrRuns.map((run, index) => {
        if (index === 0) return 0;
        return privtypes.findIndex(obj => obj.index === run.index);
    });

    useEffect(() => {
        runRefs.current = arrRuns.map((_: any, i: any) => runRefs.current[i] = React.createRef());
    }, [privtypes]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = prevActiveStep + 1;
            updateParent(indexMapping[nextStep]);
            return nextStep;
        });
    };

    const handleSkip = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = arrRuns.length - 1;
            updateParent(indexMapping[nextStep]);
            return nextStep;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const prevStep = prevActiveStep - 1;
            updateParent(indexMapping[prevStep]);
            return prevStep;
        });
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or some placeholder content for SSR
    }

    // Get current date for display
    const currentDate = dateMapping.find((obj: any) => obj.run_number === arrRuns[activeStep]?.index)?.date || '';
    
    // Progress information for mobile view
    const progressText = `${activeStep + 1} of ${arrRuns.length}`;

    return (
        <div className="w-full">
            {isMobile ? (
                // Mobile view - focused on current step only
                <div className="flex flex-col items-center">
                    {/* Current date and progress indicator */}
                    <div className="mb-2 flex flex-col items-center">
                        <div className="text-blue-600 font-medium text-lg">{currentDate}</div>
                        <div className="text-gray-500 text-sm">{progressText}</div>
                    </div>
                    
                    {/* Compact navigation buttons */}
                    <div className="flex w-full justify-between mt-3">
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className="px-4 py-1"
                            sx={{ 
                                minWidth: '32px', 
                                fontSize: '0.75rem',
                                backgroundColor: 'grey', 
                                color: 'white', 
                                '&:hover': { 
                                    backgroundColor: 'black', 
                                    color: 'white' 
                                } 
                            }}
                        >
                            Prev
                        </Button>
                        
                        <Button
                            onClick={handleSkip}
                            disabled={activeStep === arrRuns.length - 1}
                            className="px-4 py-1"
                            sx={{ 
                                minWidth: '32px',
                                fontSize: '0.75rem',
                                backgroundColor: 'grey', 
                                color: 'white', 
                                '&:hover': { 
                                    backgroundColor: 'black', 
                                    color: 'white' 
                                } 
                            }}
                        >
                            End
                        </Button>
                        
                        <Button
                            onClick={handleNext}
                            disabled={activeStep === arrRuns.length - 1}
                            className="px-4 py-1"
                            sx={{ 
                                minWidth: '32px',
                                fontSize: '0.75rem',
                                backgroundColor: 'grey', 
                                color: 'white', 
                                '&:hover': { 
                                    backgroundColor: 'black', 
                                    color: 'white' 
                                } 
                            }}
                        >
                            Next
                        </Button>
                    </div>
                    
                    {/* Show skipped runs information if applicable */}
                    {skippedRuns[activeStep] > 0 && (
                        <div className="mt-2 text-center text-xs text-gray-500">
                            {`${skippedRuns[activeStep]} identical measurement${skippedRuns[activeStep] > 1 ? 's' : ''} skipped`}
                        </div>
                    )}
                </div>
            ) : (
                // Desktop view - full stepper
                <>
                    <Stepper className="overflow-x-scroll scrollbar-hide" activeStep={activeStep}>
                        {arrRuns.map((data: any, index: number) => (
                            <Step ref={runRefs.current[index]} key={index} className='flex'>
                                {skippedRuns[index] > 0 && (
                                    <>
                                    <span className="mx-2 border-b border-gray-500 flex-1"></span>
                                    <span className="mr-5 text-sm text-gray-500">
                                        {`${skippedRuns[index]} identical measurement${skippedRuns[index] > 1 ? 's' : ''}`}
                                    </span>
                                    </>
                                )}
                                <CustomStepLabel active={index === activeStep}>
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
                                disabled={activeStep === arrRuns.length - 1}
                                sx={{ mr: 1, backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'black', color: 'white' } }}
                            >
                                Next
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                                onClick={handleSkip}
                                disabled={activeStep === arrRuns.length - 1}
                                sx={{ mr: 1, backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'black', color: 'white' } }}
                            >
                                Skip to End
                            </Button>
                        </Box>
                    </div>
                </>
            )}
        </div>
    );
}

export default HorizontalTimeline;