import Image from 'next/image'
import Navbar from '@/components/navbar'
import grid from "@/assets/grid.png"
import Landing from '@/components/landing'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col max-[800px]:items-center">
      <div className='max-[800px]:px-4 max-[800px]:py-8 py-6  px-16'>

      <Navbar/>

      <Landing/>

      </div>
      <Image src={grid} className='w-[100%] fixed bottom-0 min-[2000px]:bottom-[-150px] z-[-10]'/>
    </main>
  )
}
