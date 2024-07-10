import React, { useEffect, useRef, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, StepConnector, stepConnectorClasses, styled } from '@mui/material';
var data = require("../../../Misc/dates_and_runs.json");

// { privtypes, activeIndex, updateParent, handleClick }: { privtypes: any, activeIndex: any, updateParent: any, handleClick: any }
function HorizontalTimeline({data}:{data:any}) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [mounted, setMounted] = useState(false);

    const privDates = data[1]["privacy"]
    console.log("timeline", privDates)

    const runRefs = useRef<any[]>([]);

    useEffect(() => {
      runRefs.current = privDates.map((_: any, i: any) => runRefs.current[i] = React.createRef());
      console.log("refs", runRefs)
    }, [privDates]);

    const scrollToStep = (stepIndex: number) => {
      console.log("index called", stepIndex)
      if (runRefs.current[stepIndex] && runRefs.current[stepIndex].current) {
          console.log("got into here")
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
            return nextStep;
        });
    };

    const handleSkip = () => {
      setActiveStep((prevActiveStep) => {
        const nextStep = privDates.length - 1;
        scrollToStep(privDates.length-1);
        return nextStep;
      });
    }
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => {
          const prevStep = prevActiveStep - 1;
          scrollToStep(prevStep);
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
        <div className='w-full'>
        <Stepper className='overflow-x-scroll scrollbar-hide' activeStep={activeStep}>
          {privDates.map((data:any, index:number) => {
            return (
              <Step ref={runRefs.current[index]} className='' key={index}>
                <StepLabel className=''>{data.index}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={handleSkip}
              disabled={activeStep === privDates.length - 1}
            >
              Skip to End
            </Button>
            <Button
              onClick={handleNext}
              disabled={activeStep === privDates.length - 1}
            >
              Next
            </Button>
          </Box>
        </div>
        
      </div>
    );
}

export default HorizontalTimeline