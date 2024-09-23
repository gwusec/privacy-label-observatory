import React, { useEffect, useRef, useState } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Typography } from '@mui/material';
var data = require("../../../backend/Misc/dates_and_runs.json");

function VerticalTimeline({ privtypes, activeIndex, updateParent, handleClick }: { privtypes: any, activeIndex: any, updateParent: any, handleClick: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runRefs = useRef<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dateMapping, setDateMapping] = useState(JSON.parse(JSON.stringify(data)));

  useEffect(() => {
    runRefs.current = privtypes.map((_: any, i: any) => runRefs.current[i] ?? React.createRef());
  }, [privtypes]);

  useEffect(() => {
    const elementIndexMap = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = elementIndexMap.get(entry.target);
          updateParent(index);

          // Scroll the timeline item to the center of the container
          if (containerRef.current) {
            const containerHeight = containerRef.current.getBoundingClientRect().height;
            const elementHeight = entry.target.getBoundingClientRect().height;
            const offset = entry.target.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top;
            const scrollPosition = containerRef.current.scrollTop + offset - (containerHeight / 2) + 50;

            containerRef.current.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    }, {
      root: containerRef.current,
      threshold: 0.01, // Trigger when the element is at least 50% visible
    });

    runRefs.current.forEach((ref, index) => {
      if (ref.current) {
        elementIndexMap.set(ref.current, index);
        observer.observe(ref.current);
      }
    });

    return () => {
      runRefs.current.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [updateParent]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or some placeholder content for SSR
  }

  return (
    <div className='max-h-96 border scrollbar-hide overflow-y-auto' ref={containerRef}>
      <Timeline position="right">
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" className='text-black dark:text-white'>
              Start
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector sx={{ height: '50vh' }} />
          </TimelineSeparator>
        </TimelineItem>
        {privtypes.map((event: any, index: any) => (
          <TimelineItem key={index} ref={runRefs.current[index]}>
            <TimelineOppositeContent>
              <Typography variant="body2" className='text-black dark:text-white'>
                {dateMapping.find((obj: any) => obj.run_number === event.index)?.date}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                onClick={() => handleClick(event, index)}
                style={{ backgroundColor: index === activeIndex ? 'blue' : 'gray' }}
              />
              {index < privtypes.length - 1 && <TimelineConnector sx={{ height: '50vh' }} />}
            </TimelineSeparator>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

export default VerticalTimeline;
