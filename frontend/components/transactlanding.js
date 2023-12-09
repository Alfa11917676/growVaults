import Depositlanding from "./depositlanding";
import Poolinfo from "./poolinfo";

export default function TransactLanding(){
    return (
        <div className="min-[1500px]:w-[70rem] w-[70%] mx-auto grid max-[800px]:grid-flow-row min-[801px]:grid-flow-col max-[800px]:grid-rows-2 gap-8 min-[801px]:grid-cols-2 mt-16  max-[800px]:w-[90%]">
            <Poolinfo/>
            <Depositlanding/>
        </div>
    )
}