"use client"

import { useEffect, useState } from "react"
import input from "@/assets/inputbox.png"
import Image from "next/image"
import {useSelector } from "react-redux";
import {ethers} from "ethers"
import vaultABI from "./vaultabi";
import coinABI from "./coinabi";
// import BigNumber from "ethers"
import loader from "@/assets/dep-with-loader_1.gif"
import { usePathname } from 'next/navigation'

export default function Depositlanding({heading}){
    
    const pathname = usePathname();

    const [state, setState] = useState("deposit");

    const asset = useSelector((state)=>state.click.asset);
    const user = useSelector((state)=>state.click.account);
    const [depamount, setdepamount] = useState("");
    const [withamount, setWithamount] = useState("")
    const [receive, setReceive] = useState("")
    const [withdrawBalance, setWithdrawbalance] = useState("");
    const [manualSlippage, setManualSlippage] = useState(false);
    const [withdrawToUser, setWithdrawToUser] = useState(true);
    const [loading, setLoading] = useState(false);
    const [withdrawUser, setWithdrawuser] = useState("");
    const [lowAllowance, setLowallowance] = useState(false);
    const [currentPrice, setCurrentPrice] = useState("1");
    const [fees, setFees] = useState({vault:"0.0",platform:"0.0"});

    const [showModal, setShowModal] = useState(false);

    const [slippage, setSlippage] = useState(0.3);

    const vaultAdd = "0x0E324131df6E1032efC0A47a9D368AfeD89eE42f";

    const coinAdd = "0x491866Bacda37014B0591DF649dCb2E12D2A37C4";
    async function vaultsetup(){

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        try{const contract = new ethers.Contract( vaultAdd , vaultABI , signer );

        setWithdrawbalance(String(await contract.maxRedeem(user)));

        const n = await contract.currentPrice()
        setCurrentPrice(ethers.utils.formatEther(n))

        return contract;}
        catch(err){
            console.log(err)
        }
 // dispatch(userAsset([symbol, depamount]))

    }

    async function checkAllowance(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract( coinAdd , coinABI , signer );

        const allowance = await contract.allowance(user, vaultAdd);
        // const allowance = await contract.decreaseAllowance("0x0B61505Fe94E450C9eE651F29532b668ACbF932F", "9000000000000000001", {gasLimit: 30000});

        console.log("Allowance", String(allowance));

        return allowance;

    }

     const handledepamountChange = async (e) => {
        setdepamount((e.target.value)); 
        
      };

      const handleWithdrawUser = async (e) => {
        setWithdrawuser((e.target.value)); 
        
      };

      const handleWithamount = async (e) => {
        setWithamount((e.target.value)); 
        
      };

      const handleslippage = async (e) => {
        setSlippage((e.target.value)); 
        
      };

      async function getFees(){
        const contract = await vaultsetup();
        if(contract){
          if(state == "deposit"){
            const n = await contract.entryFeeParameter();
            setFees({vault:ethers.utils.formatEther(n),platform:"0.0"})
          }else{
            const n = await contract.exitFeeParameter();
            const n1 = await contract.protocolExitFee();
            setFees({vault:ethers.utils.formatEther(n),platform:ethers.utils.formatEther(n1)})
          }
        }

      }


      async function preview(){

        const contract = await vaultsetup();

        if(contract){

            // const prev = await contract.previewDeposit(ethers.utils.parseUnits(depamount, 18));
            const prev = ethers.utils.parseUnits(depamount, 18);
            var recv = prev - prev*slippage/100;
            recv = String((recv/10**18).toFixed(18));
            // console.log(typeof(recv), recv)
            setReceive(recv);
        }
    }
    
      async function withdraw(){

        const contract = await vaultsetup();

        setLoading(true);

        if(!withdrawToUser){
            await contract.redeem(ethers.utils.parseEther(withamount), withdrawUser, user, {gasLimit: 300000}).then((res)=>{console.log(res); setLoading(false)}).catch((err)=>{console.log(err); setLoading(false)});
        }

        else{
            await contract.redeem(ethers.utils.parseEther(withamount), user, user, {gasLimit: 300000}).then((res)=>{console.log(res); setLoading(false)}).catch((err)=>{console.log(err); setLoading(false)});
        }
      }

      async function deposit(){

        const contract = await vaultsetup();
        const allow = await checkAllowance();
        // console.log(contract);
        setLoading(true);

        if(allow > depamount){

            console.log(ethers.utils.parseEther(depamount), ethers.utils.parseEther(receive))
            // await contract.depositSlippage(ethers.utils.parseEther(depamount), user, ethers.utils.parseEther(receive),{gasLimit: 300000}).then((res)=>{console.log(res); setLoading(false)}).catch((err)=>{console.log(err); setLoading(false);});

            await contract.deposit(ethers.utils.parseEther(depamount), user,{gasPrice: 7000000000}).then((res)=>{console.log(res); setLoading(false)}).catch((err)=>{console.log(err); setLoading(false);});

        }

        else{
            setLowallowance(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const contract = new ethers.Contract( coinAdd , coinABI , signer);

            contract.approve(vaultAdd, asset[1]).then((res)=>{console.log(res);})
            setLoading(false);
        }
      }



    useEffect(()=>{
        preview();
        // console.log(slippage);
    },[depamount, slippage])

    useEffect(()=>{
        vaultsetup();
        getFees();
    },[user, state, loading])



    return (
        <div className={`relative ${pathname === "/transact" ? "bg-gradient-to-b from-[#00ffff] to-[#ffe500]" : null} p-[0.1rem] `}>
            
                    {!heading && <div className="absolute top-0 left-0 bg-gradient-to-b from-[#00ffff]/80 to-[#ffe500]/80 blur-xl h-full w-full z-[-1]"></div>}


                {lowAllowance && <div className="bg-red-400 text-center">
                <h2 className="text-center text-[1.3rem] max-[800px]:text-[4.3vw]">LOW ALLOWANCE!</h2>
                </div>}
                <div className={`bg-[#202020] max-[800px]:px-4 px-10 py-6 ${heading? "min-[801px]:w-[500px] min-[1500px]:mt-10  min-[1500px]:w-[100%] min-[1500px]:h-[645px] min-[801px]:h-[600px] ": "max-[800px]:h-[510px] w-[100%] min-[1500px]:h-[600px] min-[801px]:h-[550px]"} mx-auto`}>
            {heading && <h2 className="max-[800px]:text-[5vw] text-[1.6rem] pb-4 border-b-2 border-gray-700">{heading}</h2>}
            {loading? <Image src={loader} className="w-[50%] mx-auto my-auto translate-y-1/2"/> :
            <div className="">
                <button onClick={()=>{setState("deposit")}} className={`p-4 ${state == "deposit"? "text-white": "text-gray-500"} text-[1.3rem] max-[800px]:text-[4.3vw] `}>
                    Deposit
                </button>
                <button onClick={()=>{setState("withdraw")}} className={`p-4 ${state == "withdraw"? "text-white": "text-gray-500"} text-[1.3rem] max-[800px]:text-[4.3vw] `}>
                    Withdraw
                </button>
             <button className="max-[800px]:ms-0 ms-16"><p>Price: {parseFloat(Number(currentPrice).toFixed(3))}</p></button>


            {state == "deposit" && <div>
                 <div className="grid grid-flow-col grid-cols-3">

                <h3 className="col-span-1 text-[1rem] max-[800px]:text-[3.5vw]">Amount</h3>
                <h3 className="col-span-2 text-[0.8rem] flex justify-end max-[800px]:text-[3vw] items-center">Balance: {(asset[1]/10**18).toFixed(2)} {asset[0]}</h3>
            </div>

            <div className="bg-inputbox flex flex-row items-center border-t-[1px] border-r-[1px] border-white/50">
                <input placeholder="0.0" type="number" onChange={handledepamountChange} value={depamount} className=" min-[1500px]:text-[1rem] px-[1.4rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none bg-transparent p-3 text-[1.3rem] max-[800px]:text-[3.5vw] w-[100%]">
                </input>
            

                
                <button className="bg-[#00ffff] py-2 my-4 px-4 mx-4 text-black shadow-md shadow-[#00ffff]/50 hover:bg-[#1cc2c2]" onClick={()=>{setdepamount(String(asset[1]/10**18))}} >
                    MAX
                </button>
            </div>

            <h3 className="text-[1rem] max-[800px]:text-[3.5vw] mt-4">Receive</h3>

            <div className="bg-inputbox bg-no-repeat flex flex-row items-center border-t-[1px] border-r-[1px] border-white/50 max-[800px]:py-[3px]">
                <input placeholder="0.0" type="number" value={receive} className="p-[1.48rem] max-[1500px]:p-[1.5rem] min-[1500px]:text-[1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none bg-transparent text-[1.3rem] max-[800px]:text-[3.5vw] w-[100%]">
                </input>
            
            </div>

            <div className="grid grid-flow-col grid-cols-2 mt-4">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Vault Fees</h3>
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">{fees.vault}%</h3>
            </div>

            <div className="grid grid-flow-col grid-cols-2 mt-3">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Platform Fees</h3>
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">{fees.platform}%</h3>
            </div>


            <div className="grid grid-flow-col grid-cols-2 relative mt-4 items-center">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Manual Slippage</h3>
                <div className="w-[60px] h-[30px] bg-white/5 absolute right-0 " onClick={()=>{
                    if(!manualSlippage){
                        setManualSlippage(true);
                        setSlippage(null);
                    }

                    else{
                        setManualSlippage(false);
                        setSlippage(0.3);
                    }
                }}>
                    <div className={`w-[30px] h-[30px] ${manualSlippage?" bg-[#00ffff] float-right shadow-xl shadow-[#00ffff]/20 ": " bg-white/40 " } `}>
                    </div>
                </div>
                
            </div>

            {!manualSlippage ? <div className="grid grid-flow-col grid-cols-2 relative mt-4 items-center">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Slippage</h3>
                <div onClick={()=>{ if(!showModal)
               {setShowModal(true); }
                else {
                    setShowModal(false);
                }}} className="flex relative items-center justify-end w-[100%] bg-yellow-300 shadow-md shadow-yellow-300/50 px-5 py-2 text-black">
                <h2 className="text-[1.2rem] max-[800px]:text-[3.8vw] ">{slippage}</h2>

                {showModal && <div className="absolute bottom-[-3rem] py-2 px-5 left-0 text-center w-full bg-yellow-300 mx-auto z-10" onClick={()=>{
                            if(slippage == 0.3){
                                setSlippage(0.5);
                                
                            }
                            else{
                                setSlippage(0.3)
                             
                            }
                        }} >
                    <ul className="flex items-center justify-end">
                        <li className="text-[1.2rem] max-[800px]:text-[3.8vw] ">{slippage==0.3? 0.5: 0.3}</li>
                    </ul>
                    </div>}


                </div> 
                
            </div>: 
            <div className="bg-inputbox flex flex-row items-center border-t-[1px] border-r-[1px] mt-2 border-white/50">
            <input placeholder="0.0" type="number" value={slippage} onChange={handleslippage} className="p-[1.49rem] min-[1500px]:text-[1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none bg-transparent text-[1.3rem] max-[800px]:text-[3.5vw] w-[100%]">
            </input>
        
        </div>
            }
            
    
            <div className="bg-gradient-to-l from-[#ffe500] min-[1500px]:translate-y-4 to-[#00ffff] p-[0.1rem] mt-3">
                <button onClick={deposit} className="bg-[#202020] w-full max-[800px]:text-[6vw] py-2 text-[1.7rem] hover:bg-gradient-to-l from-[#ffe500]/20 to-[#00ffff]/20">
                    Deposit
                </button>
            </div>


            </div>}







            {state == "withdraw" && <div>
                 <div className="grid grid-flow-col grid-cols-2">

                <h3 className="text-[1rem] max-[800px]:text-[3.5vw]">Amount</h3>
                <h3 className="text-[0.8rem] flex justify-end max-[800px]:text-[3vw] items-center">Balance: {(withdrawBalance/10**18).toFixed(2)} {asset[0]}</h3>
            </div>

            <div className="bg-inputbox flex flex-row items-center border-t-[1px] border-r-[1px] border-white/50">
                <input placeholder="0.0" value={withamount} onChange={handleWithamount} type="number" className=" min-[1500px]:text-[1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none bg-transparent p-3 text-[1.3rem] max-[800px]:text-[3.5vw] w-[100%]">
                </input>
               {/* <div onClick={()=>{ if(!showModal)
               {setShowModal(true); }
                else {
                    setShowModal(false);
                }}} className="flex relative items-center bg-yellow-300 shadow-md shadow-yellow-300/50 px-5 py-2 text-black">
                <h2>{coin}</h2>

                {showModal && <div className="absolute bottom-[-3rem] left-0 text-center bg-yellow-300 mx-auto">
                    <ul className="flex items-center justify-center px-5 py-2">
                        <li onClick={()=>{
                            if(coin == "USDC"){
                                setCoin("ETH")
                            }
                            else{
                                setCoin("USDC")
                            }
                        }} className="w-full">{coin=="ETH"? "USDC": "ETH"}</li>
                    </ul>
                    </div>}


                </div>  */}
                <button className="bg-[#00ffff] py-2 my-4 px-4 mx-4 text-black shadow-md shadow-[#00ffff]/50 hover:bg-[#1cc2c2]" onClick={()=>(setWithamount(String(withdrawBalance/10**18)))} >
                    MAX
                </button>
            </div>

            <div className="grid grid-flow-col relative grid-cols-2 mt-4 items-center">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Your Wallet</h3>
                <div className="w-[60px] h-[30px] bg-white/5 absolute right-0 " onClick={()=>{
                    if(withdrawToUser){
                        setWithdrawToUser(false);
                    }

                    else{
                        setWithdrawToUser(true);
                    }
                }}>
                    <div className={`w-[30px] h-[30px] ${withdrawToUser?" bg-[#00ffff] float-right shadow-xl shadow-[#00ffff]/20 ": " bg-white/40 " } `}>
                    </div>
                </div>
            </div>

            {!withdrawToUser && <h3 className="text-[1rem] max-[800px]:text-[3.5vw] mt-4">Wallet Address</h3>}

            {!withdrawToUser && <div className="bg-inputbox bg-no-repeat flex flex-col border-t-[1px] border-r-[1px] border-white/50">
            
                <input placeholder="Address" onChange={handleWithdrawUser} value={withdrawUser} className="min-[1500px]:text-[1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none bg-transparent px-3 py-[1.62rem] min-[1500px]:py-[1.4rem] min-[801px]:py-[1.39rem]  text-[1.3rem] max-[800px]:text-[3.5vw] w-[100%]">
                    
                </input>
                
                
            </div>}



            <div className="grid grid-flow-col grid-cols-2 mt-4">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Vault Fees</h3>
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">{fees.vault}%</h3>
            </div>

            <div className="grid grid-flow-col grid-cols-2 mt-4">
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw]">Platform Fees</h3>
                <h3 className="text-[1.2rem] max-[800px]:text-[3.8vw] flex justify-end">{fees.platform}%</h3>
            </div>

            

            <div className={`bg-gradient-to-l from-[#ffe500] to-[#00ffff] ${pathname === "/"? " max-[800px]:translate-y-4 ": "max-[800px]:translate-y-10" }  p-[0.1rem] min-[801px]:translate-y-16`}>
                <button onClick={withdraw} className="bg-[#202020] w-full max-[800px]:text-[6vw] py-2 text-[1.7rem] hover:bg-gradient-to-l from-[#ffe500]/20 to-[#00ffff]/20">
                    Withdraw
                </button>
            </div>


            </div>}


               
                
            </div>}
        </div>
            
        </div>
        
            )
}