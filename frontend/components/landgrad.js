import pentagon from "@/assets/pentagon.png"
import Image from "next/image"
import Depositlanding from "./depositlanding"
import Link from "next/link"

export default function Landgrad(){
    return(
        <div className="min-[801px]:absolute top-0 max-[800px]:top-10 right-0 z-40">
            <Image src={pentagon} className="w-[40rem] max-[800px]:hidden min-[801px]:w-[45vw] min-[1500px]:w-[45rem]"></Image>

            <div className="min-[501px]:w-[80%] min-[801px]:w-[41rem] min-[1500px]:w-[45rem] max-[800px]:mx-auto max-[800px]:translate-y-40 flex flex-col items-center justify-center max-[800px]:mb-10 max-[800px]:bg-gradient-to-r from-[#00ffff] to-[#ffe500] min-[801px]:mt-6 p-[0.1rem] translate-y-20 w-[100%] min-[801px]:absolute top-0">
                <Depositlanding heading="Arch's Vault Testing Pool"/>
                <Link href="/transact" className="bg-[#202020]/40 mb-2 hover:bg-[#202020]/60 duration-200 text-center text-[1.2rem] w-[40%] max-[800px]:w-[70%] mt-2 max-[800px]:text-[5vw] p-3">
                    <button >Maximize View</button>
                </Link>
            </div>

            <div className="bg-gradient-to-b from-[#00ffff] max-[800px]:hidden to-[#ffe500] blur-2xl min-[1500px]:w-[45rem] min-[1500px]:h-[90vh] w-[43vw] h-[94vh] absolute top-0 right-0 z-[-1]">
               
            </div>
         
            
        </div>
    )
}