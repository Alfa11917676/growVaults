"use client"

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
import grid from "@/assets/grid.png"
import Navbar from "@/components/navbar"
import Graphs from "@/components/graphs"
import Image from "next/image"
import Displaygraph from "@/components/displaygraph";

const client = new ApolloClient({
    uri : "https://api.studio.thegraph.com/query/60979/arch-vault/v0.0.1",
    cache: new InMemoryCache()
})


  loadDevMessages();
  loadErrorMessages();


export default function Home(){

   

    return(<ApolloProvider client={client}>
    
    <main className="flex min-h-screen flex-col max-[800px]:items-center">

        
        <div className='max-[800px]:px-4 max-[800px]:py-8 py-6 px-16'>
        <Navbar/>
        <Displaygraph/>
        
        </div>
        <Image src={grid} className='w-[100%] fixed bottom-0 z-[-10]'/>
        
    </main>
    </ApolloProvider>)
}