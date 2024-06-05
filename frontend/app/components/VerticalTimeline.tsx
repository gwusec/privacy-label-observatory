import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Typography } from '@mui/material';
var data = require("../../../Misc/dates_and_runs.json")

function VerticalTimeline({privtypes, activeIndex, updateParent, handleClick}) {
  const runRefs = useRef<any[]>([])
  const [mounted, setMounted] = useState(false);
  const [dateMapping, setDateMapping] = useState(JSON.parse(JSON.stringify(data)));

  useEffect(() => {
    runRefs.current = privtypes.map((_, i) => runRefs.current[i] ?? React.createRef());
  }, [privtypes]);

  useEffect(() => {

    const elementIndexMap = new Map();
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = elementIndexMap.get(entry.target);
          console.log("index", index)
          updateParent(index);
        }
      })
    })
    
    runRefs.current.forEach((ref, index) => {
      if(ref.current){
        elementIndexMap.set(ref.current, index);
        observer.observe(ref.current)
      }

    });

    return () => {
      runRefs.current.forEach(ref => {
        if(ref.current){
          observer.unobserve(ref.current);
        }
      })
    }
  })

  useEffect(() => {
    console.log(runRefs)
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or some placeholder content for SSR
  }

  return (
      <div className='max-h-96 scrollbar-hide overflow-y-auto'>
        <Timeline position="right">
          {privtypes.map((event:any, index:any) => (
            <TimelineItem key={index} ref={runRefs.current[index]}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {dateMapping.find((obj) => obj.run_number === event.index).date}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot onClick={() => handleClick(event, index)}
                style={{ backgroundColor: index === activeIndex ? 'blue' : 'gray'}} />
                {index < privtypes.length - 1 && <TimelineConnector sx={{ height: '50vh' }}/>}
              </TimelineSeparator>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
  );
}

export default VerticalTimeline;
