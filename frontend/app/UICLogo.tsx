import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import logoBlack from "./resources/uic_black.png"
import logoWhite from "./resources/uic_white.png"

export default function UICIcon(){
    const [mounted, setMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    } , [] )

    if(!mounted) return (<img src={logoBlack} className="max-h-10 mr-2"/>)

    return(
        <div>
            {theme === 'dark' ?
                <img src={logoWhite} className="max-h-10 mr-2"/>
                :
                <img src={logoBlack} className="max-h-10 mr-2"/>}
        </div>
    );


}