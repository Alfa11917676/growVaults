import grid from "@/assets/grid.png"
import Navbar from "@/components/navbar"
import TransactLanding from "@/components/transactlanding"
import Image from "next/image"


export default function Home(){
    return(<main className="flex min-h-screen flex-col max-[800px]:items-center">

        
        <div className='max-[800px]:px-4 max-[800px]:py-8 py-6 px-16'>
        <Navbar/>
        <TransactLanding/>

        </div>
        <Image src={grid} className='w-[100%] fixed bottom-0 z-[-10]'/>
        
    </main>)
}