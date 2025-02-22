import { useState, useEffect } from "react";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { extractSets, generateCombinations, VennDiagram } from '@upsetjs/react';
import { VennDiagramFontSizes } from "@upsetjs/react";

function VennDiagrams({ data }: { data: any }) {
    const { theme } = useTheme();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set the initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fullMapping = {
        'Data Not Collected': data['not_collected'],
        'Data Not Linked to You': data['not_linked'],
        'Data Linked to You': data['linked'],
        'Data Used to Track You': data['track'],
        '(Data Not Linked to You ∩ Data Linked to You)': data['linked_not_linked'],
        '(Data Not Linked to You ∩ Data Used to Track You)': data['track_not_linked'],
        '(Data Linked to You ∩ Data Used to Track You)': data['track_linked'],
        '(Data Not Linked to You ∩ Data Linked to You ∩ Data Used to Track You)': data['all_three'],
    };

    const abbreviatedMapping = {
        'DNC': data['not_collected'],
        'DNLTY': data['not_linked'],
        'DLTY': data['linked'],
        'DUTY': data['track'],
        '(DNLTY ∩ DLTY)': data['linked_not_linked'],
        '(DNLTY ∩ DUTY)': data['track_not_linked'],
        '(DLTY ∩ DUTY)': data['track_linked'],
        '(DNLTY ∩ DLTY ∩ DUTY)': data['all_three'],
    };

    const mapping = isMobile ? abbreviatedMapping : fullMapping;

    const elems = useMemo(
        () => {
            const baseElems = [
                { sets: ['Data Not Linked to You'], value: data['not_linked'] },
                { sets: ['Data Linked to You'], value: data['linked'] },
                { sets: ['Data Used to Track You'], value: data['track'] },
                { sets: ['Data Not Linked to You', 'Data Linked to You'], value: data['linked_not_linked'] },
                { sets: ['Data Not Linked to You', 'Data Used to Track You'], value: data['track_not_linked'] },
                { sets: ['Data Linked to You', 'Data Used to Track You'], value: data['track_linked'] },
                { sets: ['Data Not Linked to You', 'Data Linked to You', 'Data Used to Track You'], value: data['all_three'] },
            ];

            if (isMobile) {
                // Adjust the keys for abbreviations when mobile
                return baseElems.map(elem => {
                    return {
                        sets: elem.sets.map(set => {
                            switch (set) {
                                case 'Data Not Linked to You': return 'DNLTY';
                                case 'Data Linked to You': return 'DLTY';
                                case 'Data Used to Track You': return 'DUTY';
                                case 'Data Not Collected': return 'DNC';
                                default: return set;
                            }
                        }),
                        value: elem.value,
                    };
                });
            }

            return baseElems; // Return original values for non-mobile
        },
        [data, isMobile]  // Ensure useMemo recalculates when `data` or `isMobile` changes
    );

    const singularElem = useMemo(
        () => {
            const baseSingularElem = [
                { sets: ['Data Not Collected'], value: data['not_collected'] },
            ];

            if (isMobile) {
                // Adjust for abbreviations in singularElem
                return baseSingularElem.map(elem => {
                    return {
                        sets: elem.sets.map(set => {
                            switch (set) {
                                case 'Data Not Collected': return 'DNC';
                                default: return set;
                            }
                        }),
                        value: elem.value,
                    };
                });
            }

            return baseSingularElem; // Return original for non-mobile
        },
        [data, isMobile]  // Recalculate when `data` or `isMobile` changes
    );

    const set = useMemo(() => extractSets(singularElem), [singularElem])
    const combination = useMemo(() => generateCombinations(set), [set]);

    const sets = useMemo(() => extractSets(elems), [elems]);
    const combinations = useMemo(() => generateCombinations(sets), [sets]);

    combination.forEach(combine => {
        combine.cardinality = mapping[combine.name]
    })

    combinations.forEach(combination => {
        combination.cardinality = mapping[combination.name]
    })

    const fontSizes: VennDiagramFontSizes = {
        valueLabel: isMobile ? '10px' : '14px',
    };


    return (
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full bg-inherit p-5 justify-center items-center space-y-5 overflow-visible`}>
            {/* Main Venn Diagram */}
            <VennDiagram
                sets={sets}
                padding={isMobile ? 15 : 20} // Increased padding
                combinations={combinations}
                theme={theme === 'dark' ? 'dark' : 'light'}
                width={isMobile ? 350 : 800} // Increased width for mobile and desktop
                height={isMobile ? 300 : 500} // Increased height for mobile and desktop
                strokeColor="blue"
                fontSizes={fontSizes}
                exportButtons={false}
                className="z-10 bg-inherit overflow-visible" // Ensures labels are not cut off
            />

            {/* Singular Data Venn Diagram */}
            <VennDiagram
                sets={set}
                combinations={combination}
                width={isMobile ? 300 : 450} // Adjusted width for better visibility
                height={isMobile ? 200 : 250} // Adjusted height for better visibility
                strokeColor="rgba(255, 206, 86, 1)"
                fontSizes={fontSizes}
                theme={theme === 'dark' ? 'dark' : 'light'}
                exportButtons={false}
                className={`w-fit bg-inherit overflow-visible ${isMobile ? 'mt-5' : '-ml-28'}`}
            />
        </div>
    );

}

export default VennDiagrams