import React, {useEffect, useState} from "react";
import GWIcon from "../GWIcon";
import UICIcon from "../UICLogo";
import RichIcon from "../resources/shield_ur.svg"


export default function Footer(){
    return(
        <div className="border-2 shadow-xl">
            <div className="flex flex-row justify-evenly py-2">
                <div className="mr-2">
                    <GWIcon></GWIcon>
                </div>
                <div className="mr-2">
                    <UICIcon></UICIcon>
                </div>
                <div>
                    <img src={RichIcon} alt="" className="sm:w-12 sm:h-12 size-12"/>
                </div>
            </div>
        </div>
    );
}