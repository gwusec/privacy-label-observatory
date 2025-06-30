import { useEffect, useState } from 'react';

interface DataCategories {
    identifier: String, 
    dataTypes: String[]
};

interface Purposes{
    identifier: String, 
    dataCategories: DataCategories[]
};

interface PrivacyTypes {
    identifier: String, 
    purposes: Purposes[]
};

interface Runs {
    index: String, 
    privacy_types: PrivacyTypes[]
};

export function ComparisonHelper(runA: PrivacyTypes[], runB: PrivacyTypes[]): boolean{
    // Ripped from stack overflow, need to write own set equality for comparisons
    const eqSet = (xs:any, ys:any) =>
        xs.size === ys.size &&
        [...xs].every((x) => ys.has(x));
    
    // Compare privacy label identifier set
    const topLevelA = new Set(
        runA.map(pt => pt.identifier)
    );
    const topLevelB = new Set(
        runB.map(pt => pt.identifier)
    );

    if(!eqSet(topLevelA, topLevelB)){
        return false;
    } 

    // Next, need to do comparisons with purposes
    for(const privacyType of topLevelA){
        const aEntry = runA.find(pt => pt.identifier === privacyType)!.purposes;
        const bEntry = runB.find(pt => pt.identifier === privacyType)!.purposes;
        let levelA = new Set(
            aEntry?.map(p => p.identifier)
        )
        let levelB = new Set(
            bEntry?.map(p => p.identifier)
        )
        if(!eqSet(levelA, levelB)){
            return false;
        } 

        // Next, the data category level
        for(const dataCategory of levelA){
            const aDC = aEntry.find(pt => pt.identifier === dataCategory)!.dataCategories;
            const bDC = bEntry.find(pt => pt.identifier === dataCategory)!.dataCategories;
            let levelADC = new Set(
                aDC?.map(p => p.identifier)
            )
            let levelBDC = new Set(
                bDC?.map(p => p.identifier)
            )
            if(!eqSet(levelADC, levelBDC)){
                return false;
            } 
            
            // Finally, the data type level
            for (const dataCat of levelADC) {
                const aDT = aDC.find(dc => dc.identifier === dataCat)!.dataTypes;
                const bDT = bDC.find(dc => dc.identifier === dataCat)!.dataTypes;

                const setADT = new Set(aDT);
                const setBDT = new Set(bDT);

                if (!eqSet(setADT, setBDT)) {
                    return false;
                }
            }

        }
    }



    return true;
}

export function ComparePrivacyLabels(runs: any) {
    // This handles cutting out the extra layers so that we only work with the base configuration of comparisons
    // Regardless of the new run configurations
    // Also, moved comparison of DUTY under purposes to simplify logic
    const sanitizedRuns: Runs[] = runs.map((run: any) => {
        const privacyTypesRaw = run.privacy_types?.privacyDetails?.privacyTypes ?? [];
    
        const privacy_types: PrivacyTypes[] = privacyTypesRaw.map((pt: any) => {
            const rawDataCategories = (pt.dataCategories || []).map((dc: any) => ({
                identifier: String(dc.identifier),
                dataTypes: (dc.dataTypes || []).map((dt: any) => String(dt)),
            }));
    
            const rawPurposes = (pt.purposes || []).map((p: any) => ({
                identifier: String(p.identifier),
                dataCategories: (p.dataCategories || []).map((dc: any) => ({
                    identifier: String(dc.identifier),
                    dataTypes: (dc.dataTypes || []).map((dt: any) => String(dt)),
                })),
            }));
    
            // If purposes is empty but dataCategories is present, wrap it in a general purpose
            const purposes = rawPurposes.length > 0
                ? rawPurposes
                : rawDataCategories.length > 0
                  ? [{ identifier: "General", dataCategories: rawDataCategories }]
                  : [];
    
            return {
                identifier: String(pt.identifier),
                purposes
            };
        });
    
        return {
            index: String(run.index),
            privacy_types,
        };
    });

    let arr = []
    arr.push(runs[0])

    // The run comparisons at each level is as follows
    // 1. compare set of privacy types
    // 2. compare set of purposes
    // 3. compare set of data categories
    // 4. compare set of data types
    for(let i = 0; i < sanitizedRuns.length - 1 ; i++){
        const currentRun = sanitizedRuns[i].privacy_types;
        const nextRun = sanitizedRuns[i+1].privacy_types;

        if(!ComparisonHelper(currentRun, nextRun)){
            arr.push(runs[i+1]);
        }
    }

    if (arr[arr.length - 1] !== runs[runs.length - 1]) {
        arr.push(runs[runs.length - 1])
    }


    return arr;
}

