"use client"

import {useSelector } from "react-redux";
import link from "@/assets/link.png"
import Image from "next/image"

export default function Poolinfo(){

    const asset = useSelector((state)=>state.click.asset);
    return (
        <div className="relative bg-gradient-to-b from-[#00ffff] to-[#ffe500] p-[0.1rem]">
            <div className="absolute top-0 left-0 bg-gradient-to-b from-[#00ffff]/80 to-[#ffe500]/80 blur-xl h-full w-full z-[-1]"></div>
            <div className="bg-[#202020] p-10 max-[800px]:p-6 min-[1500px]:h-[600px] min-[801px]:h-[550px] max-[800px]:h-[510px]">
                <h2 className="max-[800px]:text-[5vw] text-[1.5rem] pb-4 border-b-2 border-gray-700">Arch's Vault Testing Pool</h2>

                <div className="grid grid-flow-col grid-cols-2 mt-4">
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Asset</h3>
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">{asset[0]}</h3>
                </div>

                <div className="grid grid-flow-col grid-cols-2 mt-4">
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Current Price</h3>
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">0.00</h3>
                </div>

                <div className="grid grid-flow-col grid-cols-2 mt-4">
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Effective Fee</h3>
                    <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">2.34%</h3>
                </div>

             
                <a href="https://sepolia.scrollscan.dev/address/0x0E324131df6E1032efC0A47a9D368AfeD89eE42f">
                    <div className="bg-gradient-to-r translate-y-[2.5rem] from-[#00ffff]  to-[#ffe500] hover:to-[#00ffff] hover:from-[#ffe500] p-[0.1rem] mt-[10.3rem] min-[1500px]:mt-[12.5rem] min-[801px]:mt-[12.2rem]">
                        <div className="bg-[#202020]">
                            <div className="text-[1.2rem] max-[800px]:text-[4vw] hover:bg-gradient-to-r hover:from-[#00ffff]/20 hover:to-[#ffe500]/20 flex justify-center items-center gap-5 text-center py-4">
                                <h2>Contract: 0x0E32....eE42f</h2>
                                <Image src={link} className="w-[1.4rem] h-[1.4rem] max-[800px]:w-[3vw] max-[800px]:h-[3vw]"></Image>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}