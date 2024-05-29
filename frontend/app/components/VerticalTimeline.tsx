import React, { useEffect, useRef, useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Typography } from '@mui/material';

const events = [
  { date: '2023-01-01', content: 'New Year Celebration' },
  { date: '2023-02-14', content: 'Valentine\'s Day' },
  { date: '2023-07-04', content: 'Independence Day' },
  { date: '2023-10-31', content: 'Halloween' },
  { date: '2023-12-25', content: 'Christmas' },
  { date: '2023-01-01', content: 'New Year Celebration' },
  { date: '2023-02-14', content: 'Valentine\'s Day' },
  { date: '2023-07-04', content: 'Independence Day' },
  { date: '2023-10-31', content: 'Halloween' },
  { date: '2023-12-25', content: 'Christmas' },
  { date: '2023-01-01', content: 'New Year Celebration' },
  { date: '2023-02-14', content: 'Valentine\'s Day' },
  { date: '2023-07-04', content: 'Independence Day' },
  { date: '2023-10-31', content: 'Halloween' },
  { date: '2023-12-25', content: 'Christmas' },
];

function VerticalTimeline() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const timelineRefs = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(parseInt(entry.target.dataset.index, 10));
          }
        });
      },
      { threshold: 0.99 }
    );

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      timelineRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [mounted]);

  if (!mounted) {
    return null; // or some placeholder content for SSR
  }

  return (
    <Timeline position="alternate">
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          data-index={index}
          ref={(el) => (timelineRefs.current[index] = el)}
        >
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              {event.date}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color={index === activeIndex ? "primary" : "grey"} />
            {index < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography
              variant="h6"
              component="span"
              style={{
                color: index === activeIndex ? 'blue' : 'black',
                fontWeight: index === activeIndex ? 'bold' : 'normal',
              }}
            >
              {event.content}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default VerticalTimeline;