import { useTheme } from "next-themes";

// Iconography 
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

interface DataCategory {
    identifier: string;
    dataTypes: string[];
}

interface Purpose {
    purpose: string;
    identifier: string;
    dataCategories: DataCategory[] | null;
}

interface PrivacyDetail {
    identifier: string;
    dataCategories: DataCategory[] | null;
    purposes: Purpose[] | null;
}

// Category type for icon mapping
type Category = "BROWSING_HISTORY"
| "CONTACT_INFO"
| "CONTACTS"
| "DIAGNOSTICS"
| "FINANCIAL_INFO"
| "HEALTH_AND_FITNESS"
| "IDENTIFIERS"
| "LOCATION"
| "OTHER_DATA"
| "PURCHASES"
| "SEARCH_HISTORY"
| "SENSITIVE_INFO"
| "USAGE_DATA"
| "USER_CONTENT";

const iconMapping: Record<Category, { light: string; dark: string }> = {
    "BROWSING_HISTORY": {
        light: "/apple_icons/browsing_history.svg",
        dark: "/apple_icons/browsing_history_dark.svg"
    },
    "CONTACT_INFO": {
        light: "/apple_icons/contact_info.svg",
        dark: "/apple_icons/contact_info_dark.svg"
    },
    "CONTACTS": {
        light: "/apple_icons/contacts.svg",
        dark: "/apple_icons/contacts_dark.svg"
    },
    "DIAGNOSTICS": {
        light: "/apple_icons/diagnostics.svg",
        dark: "/apple_icons/diagnostics_dark.svg"
    },
    "FINANCIAL_INFO": {
        light: "/apple_icons/financial_info.svg",
        dark: "/apple_icons/financial_info_dark.svg"
    },
    "HEALTH_AND_FITNESS": {
        light: "/apple_icons/health_and_fitness.svg",
        dark: "/apple_icons/health_and_fitness_dark.svg"
    },
    "IDENTIFIERS": {
        light: "/apple_icons/identifiers.svg",
        dark: "/apple_icons/identifiers_dark.svg"
    },
    "LOCATION": {
        light: "/apple_icons/location.svg",
        dark: "/apple_icons/location_dark.svg"
    },
    "OTHER_DATA": {
        light: "/apple_icons/other_data.svg",
        dark: "/apple_icons/other_data_dark.svg"
    },
    "PURCHASES": {
        light: "/apple_icons/purchases.svg",
        dark: "/apple_icons/purchases_dark.svg"
    },
    "SEARCH_HISTORY": {
        light: "/apple_icons/search_history.svg",
        dark: "/apple_icons/search_history_dark.svg"
    },
    "SENSITIVE_INFO": {
        light: "/apple_icons/sensitive_info.svg",
        dark: "/apple_icons/sensitive_info_dark.svg"
    },
    "USAGE_DATA": {
        light: "/apple_icons/usage_data.svg",
        dark: "/apple_icons/usage_data_dark.svg"
    },
    "USER_CONTENT": {
        light: "/apple_icons/user_content.svg",
        dark: "/apple_icons/user_content_dark.svg"
    }
};

const getIconPath = (category: string, theme: string | undefined) => {
    if (category in iconMapping) {
        const icons = iconMapping[category as Category];
        return theme === 'dark' ? icons.dark : icons.light;
    }
    return theme === 'dark' ? "/apple_icons/other_data_dark.svg" : "/apple_icons/other_data.svg";
};

interface AppDataColumnProps {
    privacyDetails: PrivacyDetail;
    prevPrivacyDetails?: PrivacyDetail | null;
    configuration: {
        title: string;
        icon: string;
        id: string;
        description?: string;
    }
    showDataTypes?: boolean;
    expanded?: string | null;
    onExpand?: (column: string) => void;
    className?: string;
}

export default function AppDataColumn({ 
    privacyDetails, 
    prevPrivacyDetails = null,
    configuration,
    showDataTypes = false, 
    expanded = null,
    onExpand = () => {},
    className = "" 
}: AppDataColumnProps) {
    const { theme } = useTheme();
    const hasData = privacyDetails != null;
    const isExpanded = expanded === configuration.id;

    let numColumns = 1;
    if (privacyDetails?.purposes?.length) {
      numColumns = Math.min(
          privacyDetails.purposes.length,
          isExpanded ? 4 : 2
      );
    }
    else if (privacyDetails?.dataCategories?.length) {
      numColumns = Math.min(
          privacyDetails.dataCategories.length,
          isExpanded ? 4 : 2
      );
    }

    // Collect unique categories from privacy details
    const uniqueCategories = new Set<string>();
    if (privacyDetails?.purposes?.length === 0) {
        privacyDetails?.dataCategories!.forEach((category) => {
            uniqueCategories.add(category.identifier);
        });
    } else {
        privacyDetails?.purposes!.forEach((purpose) => {
            purpose.dataCategories!.forEach((category) =>
                uniqueCategories.add(category.identifier)
            );
        });
    }
    const sortedCategories = Array.from(uniqueCategories).sort();

    const numCollapseColumns = Math.min(1, sortedCategories.length);

    // This is a helper function to check if a dataType (when expanded) or dataCategory (when condensed) should be highlighted
    const hasChanged = (
        purpose: string,
        category: string,
        type: string = ""
    ) => {
        if (!prevPrivacyDetails) return true; // No previous detail found for this identifier

        if (purpose === "") {
            let toReturn = true;
            // We need to just look at categories and check if category exists in *any* purpose
            prevPrivacyDetails.purposes?.forEach((p) => {
                const prevCategory = p.dataCategories?.find(
                    (c) => c.identifier === category
                );
                if (prevCategory) {
                    toReturn = false; // If we find the category in any purpose, we return false
                }
            });

            // If there are no purposes, we may just need to look directly at prevDetail.dataCategories
            if (prevPrivacyDetails.dataCategories) {
                const prevCategory = prevPrivacyDetails.dataCategories.find(
                    (c) => c.identifier === category
                );
                if (prevCategory) {
                    toReturn = false; // If we find the category in any purpose, we return false
                }
            }

            return toReturn; // If we found the category in any purpose, return false, otherwise true
        } else {
            // We need to look at the specific purpose and look for changed types
            // Try to find category in previous details
            const prevPurpose = prevPrivacyDetails.purposes?.find(
                (p) => p.identifier === purpose
            );
            if (!prevPurpose) return true; // No previous purpose found

            // Try to find data category in previous purposes
            const prevCategory = prevPurpose.dataCategories?.find(
                (c) => c.identifier === category
            );
            if (!prevCategory) return true; // No previous category found

            // If type is provided, check if it exists in the previous category's dataTypes
            if (type) {
                return !prevCategory.dataTypes?.includes(type);
            }
            // If no type is provided, just check if the category exists
            return !prevPurpose.dataCategories?.some(
                (c) => c.identifier === category
            );
        }
    };

    return (
        <div
            className={`flex-1 min-w-0 m-4 rounded-lg w-full h-fit text-center p-4 shadow-md transform transition duration-200 ${
                theme === "dark" && !isExpanded
                    ? "text-white bg-neutral-800"
                    : "text-red bg-neutral-300"
            } 
                ${
                    !isExpanded
                        ? theme === "dark"
                            ? "hover:text-red hover:bg-neutral-200"
                            : "hover:text-white hover:bg-neutral-700"
                        : ""
                } 
                ${
                    isExpanded
                        ? theme === "dark"
                            ? "text-black bg-neutral-200"
                            : "text-white bg-neutral-700"
                        : ""
                } 
            } ${className}
            ${isExpanded || expanded == null ? "block" : "hidden"}
            `}
            id={configuration.id}
        >
            {/* Fullscreen icon */}
            {hasData && (
              <div className="flex justify-end">
                  {expanded ? (
                      <MdFullscreenExit
                          onClick={() => onExpand(configuration.id)}
                          size={28}
                      />
                  ) : (
                      <MdFullscreen
                          onClick={() => onExpand(configuration.id)}
                          size={28}
                      />
                  )}
              </div>
            )}
            {/* Header with icon and title */}
            <div className="flex justify-center space-x-4">
                <img src={configuration.icon} alt="" className="w-8 h-8" />
                <h3 className="text-md">{configuration.title}</h3>
            </div>

            {/* Data */}
            {hasData ? (
                <div>
                    <p className="text-center mt-4">
                        {configuration.description}
                    </p>
                    {!showDataTypes && !isExpanded ? (
                        <>
                            {/* Show small version of data types */}
                            <ul
                                className={`mt-4 pl-6 list-none grid gap-2 grid-cols-${numColumns}`}
                            >
                                {sortedCategories.map((category) => (
                                    <li
                                        key={category}
                                        className="text-md font-semibold flex items-center space-x-2"
                                    >
                                        <img
                                            src={getIconPath(category, theme)}
                                            alt={category}
                                            className="w-6 h-6"
                                        />
                                        <div className="flex items-center">
                                            {category}
                                            {hasChanged("", category) && (
                                                <span
                                                    className="ml-2 inline-block w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600"
                                                    title="Changed"
                                                />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div
                            className={`grid grid-cols-${numColumns} gap-4 mt-4`}
                        >
                            {privacyDetails.purposes!.length > 0 &&
                                privacyDetails.purposes?.map((purpose) => (
                                    <div
                                        key={purpose.identifier}
                                        className="min-w-0 w-full"
                                    >
                                        <span className="text-md font-semibold">
                                            {purpose.identifier}
                                        </span>
                                        {purpose.dataCategories!.map(
                                            (category) => (
                                                <div
                                                    key={category.identifier}
                                                    className="mb-2"
                                                >
                                                    <p>{category.identifier}</p>
                                                    <ul>
                                                        {category.dataTypes?.map(
                                                            (type) => (
                                                                <li
                                                                    key={type}
                                                                    className={`inline-block text-sm px-2 m-1 rounded-full border border-orange-400 ${
                                                                        hasChanged(
                                                                            purpose.identifier,
                                                                            category.identifier,
                                                                            type
                                                                        )
                                                                            ? "bg-yellow-200 border-yellow-600 text-black"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {type}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            {privacyDetails.dataCategories!.length > 0 &&
                                privacyDetails.dataCategories!.map(
                                    (category) => (
                                        <div
                                            key={category.identifier}
                                            className="mb-2"
                                        >
                                            <p>{category.identifier}</p>
                                            <ul>
                                                {category.dataTypes?.map(
                                                    (type) => (
                                                        <li
                                                            key={type}
                                                            className={`inline-block text-sm px-2 m-1 rounded-full border border-orange-400 ${
                                                                hasChanged(
                                                                    "",
                                                                    category.identifier,
                                                                    type
                                                                )
                                                                    ? "bg-yellow-200 border-yellow-600 text-black"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {type}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )
                                )}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center mt-4">No Data Collected</p>
            )}
        </div>
    );
};