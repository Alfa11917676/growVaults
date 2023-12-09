"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { createContext, useContext ,useState, useEffect} from "react";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { userAccount } from "@/app/Global_Redux/Reducers/Web3/click";
import {useDispatch } from "react-redux"


function Button(){



  const [accn,setAccn] = useState(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();


  const { address, isConnecting, isDisconnected } = useAccount({
    onConnect: ({ address, isReconnected, connector: activeConnector }) => {
      setLoading(true);
      setAccn(address);
      dispatch(userAccount(address));
      // registerUser(address, userName);
    },
    onDisconnect() {
      setAccn(null);

    },
  });


    return (
      
<div className="">
        <ConnectButton.Custom className="">
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
           const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <div className="p-[0.1rem] bg-gradient-to-r from-[#00ffff] to-[#ffe500]">
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-[#202020] max-[800px]:text-[5vw] py-4 px-10 text-[1.5rem] hover:bg-gradient-to-r from-[#00ffff]/10 to-[#ffe500]/10"
                      >
                        Connect Wallet
                      </button>
                      </div>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-red-500 py-4 px-10 text-[1.5rem] max-[800px]:text-[5vw] hover:bg-red-600 border-[1px] border-white"
                      >
                        Wrong Network
                      </button>
                      
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }} className="p-[0.1rem] bg-gradient-to-r from-[#00ffff] to-[#ffe500]">
                      {/* <button
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                        className=""
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 40,
                              height: 40,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 40, height: 40 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button> */}

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-[#202020] py-4 px-10 text-[1.5rem] max-[800px]:text-[4vw] hover:bg-gradient-to-r from-[#00ffff]/10 to-[#ffe500]/10"
                      >
                       {accn?.slice(0,6)+"..."+accn?.slice(-5, accn.length)}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
       </div>

    );
    
}


export default Button;
