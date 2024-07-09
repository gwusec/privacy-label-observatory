import React, { useEffect, useRef, useState } from 'react';
import {Box} from '@mui/material';
import {Stepper, Step, StepLabel, Button} from '@mui/material';
import { Typography } from '@mui/material';
var data = require("../../../Misc/dates_and_runs.json");

const steps = ["5-21", "5-28", "6-4", "6-11", "6-18", "6-25", "7-2", "7-9", "7-16", "7-23"]
// { privtypes, activeIndex, updateParent, handleClick }: { privtypes: any, activeIndex: any, updateParent: any, handleClick: any }
function HorizontalTimeline() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [mounted, setMounted] = useState(false);
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        setMounted(true);
    }, []);
  
    if (!mounted) {
        return null; // or some placeholder content for SSR
    }
  
    return (
        <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            return (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <div>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </Box>
          </div>
        ) : (
          <div>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            </Box>
          </div>
        )}
      </Box>
    );
}

export default HorizontalTimeline