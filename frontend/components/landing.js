import Image from "next/image"
import link from "@/assets/link.png"
import Landgrad from "./landgrad"

export default function Landing(){
    return(
        <div className="h-[75vh] flex max-[800px]:flex-col max-[800px]:justify-center items-center">
            <div className="max-[800px]:mt-64">

                <div className="relative text-[3.3rem] max-[800px]:text-[9vw]">
                    <h1 className="font-valorax ">Arch's Vault</h1>
                    <h1 className="font-valorax absolute top-0 translate-x-[0.15rem] translate-y-[0.15rem] text-[#00ffff] z-[-1]">Arch's Vault</h1>
                </div>


                <div className="relative text-[3.3rem] max-[800px]:text-[9vw]">
                    <h1 className="font-valorax ">Testing Pool</h1>
                    <h1 className="font-valorax absolute top-0 translate-x-[0.15rem] translate-y-[0.15rem] text-[#ffe500] z-[-1]">Testing Pool</h1>
                </div>

                <a href="https://sepolia.scrollscan.dev/address/0x0E324131df6E1032efC0A47a9D368AfeD89eE42f">
                    <div className="bg-gradient-to-r from-[#00ffff] to-[#ffe500] hover:to-[#00ffff] hover:from-[#ffe500] p-[0.1rem] mt-6">
                        <div className="bg-[#202020]">
                            <div className="text-[1.5rem] max-[800px]:text-[4vw] flex justify-center items-center gap-5 text-center bg-gradient-to-r from-[#ffe500]/10 hover:from-[#00ffff]/10 py-4">
                                <h2>Contract: 0x0E32....eE42f</h2>
                                <Image src={link} className="w-[1.4rem] h-[1.4rem] max-[800px]:w-[3vw] max-[800px]:h-[3vw]"></Image>
                            </div>
                        </div>
                    </div>
                </a>
            </div>


            <div className="">

            <Landgrad/>
            </div>
        </div>
    )
}