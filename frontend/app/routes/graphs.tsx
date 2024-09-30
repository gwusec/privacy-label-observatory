export default function Graphs() {
    const { state } = useNavigation()
    const data = useLoaderData<typeof loader>();
    const vennDiagram = data[0]
    const percentage = data[1]
    const dates = data[2]
    const longitude = data[3]
    const ratios = data[4]
    const matrix = data[5]
    const privacyTypes = data[6];

    return (
        <>
            {state === "loading" ?
                <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
                    <FaSpinner className="animate-spin" size={72} />
                </div>
                :
                <div className="w-full md:w-4/5 mx-auto px-4">
                    <div className="mb-20">
                        <h1 className="text-xl md:text-2xl">Longitude Data Chart</h1>
                        <LineChart data={longitude} />
                        <h4 className="text-sm md:text-base">
                            A longitudinal view over the year-long collection period of the total number of apps and the total number of apps with privacy labels (compliant apps). For comparison, we also display the four Privacy Types over the same period. Each data point represents a snapshot of the Apple App Store on that date.
                        </h4>
                    </div>
                    <div className="mb-20">
                        <div className="columns-3"> 
                            <div className="">
                                <h1 className="text-center mb-4">Data Used to Track You</h1>
                                <Ratios data={ratios.DATA_USED_TO_TRACK_YOU} />
                            </div>
                            <div className="">
                                <h1 className="text-center mb-4">Data Linked to You</h1>
                                <Ratios data={ratios.DATA_LINKED_TO_YOU} />
                            </div>
                            <div className="">
                                <h1 className="text-center mb-4">Data Not Linked to You</h1>
                                <Ratios data={ratios.DATA_NOT_LINKED_TO_YOU} />
                            </div>
                        </div>
                        <h4 className="text-sm md:text-base">
                            The ratios of the six Purposes for the Data Used to Track You, Data Linked to You, and Data Not Linked to You Privacy Types. The denominator is the number of apps in the specific Privacy Type.
                        </h4>
                    </div>
                    <div className="mb-20">
                        <div className="columns-3xs">
                            <div className="items-center w-full md:w-1/2">
                                <h1 className="text-center mb-4">Data Linked to You</h1>
                                <MatrixChart data={matrix.DATA_LINKED_TO_YOU} />
                            </div>
                            <div className="items-center w-full md:w-1/2">
                                <h1 className="text-center mb-4">Data Not Linked to You</h1>
                                <MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} />
                            </div>
                        </div>
                        <h4 className="text-sm md:text-base">
                            The ratios of Data Categories by the reported Purpose for the Data Linked to You (left) and Data Not Linked to You (right) Privacy Types.
                        </h4>
                    </div>
                    <div className="mb-20">
                        <VennDiagram data={vennDiagram} />
                        <h4 className="text-sm md:text-base">
                            A Venn diagram of the number of apps in each of the four Privacy Types. Data Not Collected is mutually exclusive to the other three Privacy Types.
                        </h4>
                    </div>

                    <div className="mb-20">
                        <PercentageGraph data={percentage} />
                        <h4 className="text-sm md:text-base">
                            The ratios of app costs for each of the four Privacy Types. The denominator is the number of apps with the designated app cost that have a privacy label. Free apps are more likely than paid apps to collect data, including data used to track and linked to users.
                        </h4>
                    </div >

                    <div className="mb-20">
                        <YearGraph data={dates} />
                        <h4 className="text-sm md:text-base">
                            The number of apps released during a given year for each of the four Privacy Types. The gray bars show the total number of apps with privacy labels released in that year.
                        </h4>
                    </div>

                    <div className="mb-20">
                        <h1 className="text-xl md:text-2xl">Privacy Types Data Chart</h1>
                        <PrivacyTypesChart data={privacyTypes} />
                        <h4 className="text-sm md:text-base">
                            Comparison of the data categories across different privacy types.
                        </h4>
                    </div>
                </div>
            }

        </>
    );
}
