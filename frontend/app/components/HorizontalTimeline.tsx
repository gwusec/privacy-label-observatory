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

function equal(obj1: any, obj2: any){
    
    if(obj1.privacyDetails.length == 0){
        return obj2.privacyDetails.length == 0;
    }
    
    let obj1Fields = obj1.privacyDetails[0]
    let obj2Fields = obj2.privacyDetails[0]



    if(obj1Fields.identifier != obj2Fields.identifier){
        return false;
    }

    if(obj1Fields.privacyTypes != obj2Fields.privacyTypes){
        return false;
    }

    //Checks if there's more privacy data (data not linked, data linked, data used to track) than previous run
    if(obj1Fields.length != obj2Fields.length){
        return false;
    }

    //Checks purposes and data categories to see if there's more that were added
    if(obj1Fields.dataCategories.length != obj2Fields.dataCategories.length){
        return false;
    }

    if(obj1Fields.purposes.length != obj2Fields.purposes.length){
        return false;
    }

    return true;
}

function findChanges(runs: any){
    let arr = []
    arr.push(runs[0])
    for(let i=0; i<runs.length-1; i++){
        const currentRun = runs[i];
        const nextRun = runs[i + 1];
        if (!equal(currentRun.privacy_types, nextRun.privacy_types)) {
            // You can log the differences or handle them as needed
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

    let arrRuns = findChanges(privtypes)
  
    const skippedRuns = arrRuns.map((run, index) => {
        if (index === 0) return 0; // No previous run to compare
        const currentRunNumber = privtypes.findIndex(obj => obj.index === run.index)//parseInt(run.index.split('_')[1]);
        const previousRunNumber = privtypes.findIndex(obj => obj.index === arrRuns[index - 1].index)
        return currentRunNumber - previousRunNumber - 1;
    });

    const indexMapping = arrRuns.map((run, index) => {
        if (index === 0) return 0;
        return privtypes.findIndex(obj => obj.index === run.index)//parseInt(run.index.split('_')[1]);

    })



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

    return (
        <div className="w-full">
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
                        <CustomStepLabel
                            
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
        </div>
    );
}

export default HorizontalTimeline;
