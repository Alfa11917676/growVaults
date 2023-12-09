import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import Graphs from "./graphs";
import ethers from "ethers"
import Image from "next/image"
import loader from "@/assets/loader.gif"


const RETURNED = gql`query MyQuery {
    lpprices(first: 100, skip: 0) {
      assetsLocked
      assetsMinted
      price
      blockNumber
    }
  }`


export default function Displaygraph(){

    const {loading, error, data} = useQuery(RETURNED);

    

    if(loading) return <Image src={loader} className="w-[20%] mx-auto my-auto"></Image>;
    if(error) return `error ${error.message}`


    if(data){
        console.log(data.lpprices);

        const priceArr = [];
        const lockedArr = [];
        const mintedArr = [];
        const ind = [];

        for(let i=0; i<data.lpprices.length; i++){
            
            // if((Number(data.lpprices[i].assetsMinted))/10**18 > 1 || ((Number(data.lpprices[i].price))/10**18)>1.5){
                priceArr.push(((Number(data.lpprices[i].price))/10**18));
                mintedArr.push(((Number(data.lpprices[i].assetsMinted))/10**18).toFixed(2));
                lockedArr.push(((Number(data.lpprices[i].assetsLocked))/10**18).toFixed(2));
                ind.push(((Number(data.lpprices[i].blockNumber))).toFixed(2));
            // }
        }

        console.log(priceArr);
        console.log(lockedArr);
        return (<div className="mt-24 grid min-[801px]:grid-flow-col min-[801px]:grid-cols-2 max-[800px]:grid-flow-row max-[800px]:grid-rows-2 gap-5">
            <div className="bg-gradient-to-b from-[#00ffff] to-[#ffe500] p-[0.1rem]">
                <div className="bg-[#202020] min-[801px]:p-10 text-center">
                <h1 className="text-3xl mb-5">Price vs Locked Assets</h1>
                <Graphs chartData={priceArr} chartLabels={lockedArr} colour="#ffe500"/>
                </div>
            </div>
       
       <div className="bg-gradient-to-b from-[#00ffff] to-[#ffe500] p-[0.1rem]">

            <div className="bg-[#202020] min-[801px]:p-10 text-center">
              <h1 className="text-3xl mb-5">Locked Assets vs Minted Assets</h1>
            <Graphs chartData = {lockedArr} chartLabels={mintedArr} colour="#00ffff"/>
        </div>
       </div>
        </div>
        )

    }
    // setGraphdata(data)
    return(
        <div>

        </div>
    )
}