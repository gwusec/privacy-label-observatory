import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { extractSets, generateCombinations, VennDiagram } from '@upsetjs/react';
import { VennDiagramFontSizes } from "@upsetjs/react";

function VennDiagrams({ data }: { data: any }) {
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);

    // Check once at mount if mobile view
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        // No event listener needed since we don't care about resize
    }, []);

    // Create mappings for mobile/desktop
    const mapping = useMemo(() => {
        if (isMobile) {
            return {
                'NC': data['not_collected'],
                'NLTY': data['not_linked'],
                'LTY': data['linked'],
                'UTY': data['track'],
                '(NLTY ∩ LTY)': data['linked_not_linked'],
                '(NLTY ∩ UTY)': data['track_not_linked'],
                '(LTY ∩ UTY)': data['track_linked'],
                '(NLTY ∩ LTY ∩ UTY)': data['all_three'],
            };
        } else {
            return {
                'Data Not Collected': data['not_collected'],
                'Data Not Linked to You': data['not_linked'],
                'Data Linked to You': data['linked'],
                'Data Used to Track You': data['track'],
                '(Data Not Linked to You ∩ Data Linked to You)': data['linked_not_linked'],
                '(Data Not Linked to You ∩ Data Used to Track You)': data['track_not_linked'],
                '(Data Linked to You ∩ Data Used to Track You)': data['track_linked'],
                '(Data Not Linked to You ∩ Data Linked to You ∩ Data Used to Track You)': data['all_three'],
            };
        }
    }, [data, isMobile]);

    // Elements for main diagram
    const elems = useMemo(() => {
        const baseElems = isMobile ? [
            { sets: ['NLTY'], value: data['not_linked'] },
            { sets: ['LTY'], value: data['linked'] },
            { sets: ['UTY'], value: data['track'] },
            { sets: ['NLTY', 'LTY'], value: data['linked_not_linked'] },
            { sets: ['NLTY', 'UTY'], value: data['track_not_linked'] },
            { sets: ['LTY', 'UTY'], value: data['track_linked'] },
            { sets: ['NLTY', 'LTY', 'UTY'], value: data['all_three'] },
        ] : [
            { sets: ['Data Not Linked to You'], value: data['not_linked'] },
            { sets: ['Data Linked to You'], value: data['linked'] },
            { sets: ['Data Used to Track You'], value: data['track'] },
            { sets: ['Data Not Linked to You', 'Data Linked to You'], value: data['linked_not_linked'] },
            { sets: ['Data Not Linked to You', 'Data Used to Track You'], value: data['track_not_linked'] },
            { sets: ['Data Linked to You', 'Data Used to Track You'], value: data['track_linked'] },
            { sets: ['Data Not Linked to You', 'Data Linked to You', 'Data Used to Track You'], value: data['all_three'] },
        ];
        
        return baseElems;
    }, [data, isMobile]);

    // Elements for singular diagram
    const singularElem = useMemo(() => {
        return isMobile ? 
            [{ sets: ['NC'], value: data['not_collected'] }] :
            [{ sets: ['Data Not Collected'], value: data['not_collected'] }];
    }, [data, isMobile]);

    // Extract sets and generate combinations
    const set = useMemo(() => extractSets(singularElem), [singularElem]);
    const combination = useMemo(() => generateCombinations(set), [set]);

    const sets = useMemo(() => extractSets(elems), [elems]);
    const combinations = useMemo(() => generateCombinations(sets), [sets]);

    // Apply cardinality values
    combination.forEach(combine => {
        combine.cardinality = mapping[combine.name];
    });

    combinations.forEach(combination => {
        combination.cardinality = mapping[combination.name];
    });

    // Font sizes
    const fontSizes: VennDiagramFontSizes = {
        valueLabel: isMobile ? '10px' : '14px',
    };

    return (
        <div className="flex flex-col md:flex-row w-full bg-inherit p-5 justify-center items-center space-y-5 md:space-y-0 overflow-visible">
            {/* Main Venn Diagram */}
            <VennDiagram
                sets={sets}
                padding={isMobile ? 15 : 20}
                combinations={combinations}
                theme={theme === 'dark' ? 'dark' : 'light'}
                width={isMobile ? 350 : 800}
                height={isMobile ? 300 : 500}
                strokeColor="blue"
                fontSizes={fontSizes}
                exportButtons={false}
                className="z-10 bg-inherit overflow-visible"
            />

            {/* Singular Data Venn Diagram */}
            <VennDiagram
                sets={set}
                combinations={combination}
                width={isMobile ? 300 : 450}
                height={isMobile ? 200 : 250}
                strokeColor="rgba(255, 206, 86, 1)"
                fontSizes={fontSizes}
                theme={theme === 'dark' ? 'dark' : 'light'}
                exportButtons={false}
                className="w-fit bg-inherit overflow-visible md:-ml-28"
            />
        </div>
    );
}

export default VennDiagrams;