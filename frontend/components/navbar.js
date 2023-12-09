"use client"

import Button from "./button"
import coinABI from "@/components/coinabi"
import { ethers } from "ethers";
import { userAccount, userAsset, userAmount } from "@/app/Global_Redux/Reducers/Web3/click"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation";
import vaultLogo from '../public/vault-logo.png'
// import NextRouter

export default function Navbar() {

    const coinAdd = "0x491866Bacda37014B0591DF649dCb2E12D2A37C4";
    const user = useSelector((state) => state.click.account);
    const [path, setPath] = useState("");

    // const [balance, setBalance] = useState(null);

    const dispatch = useDispatch();
    // const router = useRouter() 
    const pathname = usePathname();

    async function setup() {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        setPath(pathname);
        console.log(pathname)


        try {
            const coinContract = new ethers.Contract(coinAdd, coinABI, signer);


            const symbol = await coinContract.symbol();
            const amount = String(await coinContract.balanceOf(user));


            // setBalance(amount);
            // console.log(amount, symbol);

            dispatch(userAsset([symbol, amount]));

            return { coinContract, amount };
        }
        catch (err) {
            console.log(err);
        }


    }

    // async function allowance(){
    //     const contract = await setup();

    //     contract.coinContract.approve("0x0B61505Fe94E450C9eE651F29532b668ACbF932F", contract.amount).then((res)=>{console.log(res)});
    // }


    useEffect(() => {
        setup();
    }, [user])
    return (
        <div className="flex max-[800px]:flex-col flex-row items-center relative z-50 max-[800px]:mb-28 mt--4">
            <div className="flex">
                     <Image src={vaultLogo} className="h-[38.4px] w-[38.4px] me-2"/>
                {/* <div className="w-[2rem] h-[2rem] bg-gradient-to-b from-[#00ffff] to-[#ffe500] mr-4 max-[800px]:w-[6vw] max-[800px]:h-[6vw] ">
                </div> */}
                <h1 className="text-[1.6rem] max-[800px]:text-[5vw]">Arch Vaults</h1>
            </div>

            <Link href="/">

                <button className={`text-[1.6rem] max-[800px]:text-[5vw] ${path == "/" ? "text-white" : "text-gray-400"} hover:text-white min-[801px]:translate-x-16`}>Home</button>
            </Link>

            <Link href="/graphs">

                <button className={`text-[1.6rem] min-[801px]:ml-10 max-[800px]:text-[5vw] ${path == "/graphs" ? "text-white" : "text-gray-400"} hover:text-white min-[801px]:translate-x-16`}>Graphs</button>
            </Link>

            {/* <button onClick={allowance} className={`text-[1.6rem] min-[801px]:ml-10 text-gray-400 max-[800px]:text-[5vw] hover:text-white min-[801px]:translate-x-16`}>Allowance</button> */}


            <div className={`min-[801px]:absolute max-[800px]:mt-6 ${path === "/" ? "right-24 min-[1500px]:right-[9.8rem] min-[801px]:right-[6.4rem]" : "right-0"} top-0`}>
                <Button />
            </div>
        </div>
    )
}