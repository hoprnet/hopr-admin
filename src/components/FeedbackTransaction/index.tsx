import { Address, useWaitForTransaction } from "wagmi"

export const FeedbackTransaction = ({
  transactionHash,
  confirmations,
}: { transactionHash: Address, confirmations: number }) => {
  const { status } = useWaitForTransaction({
    confirmations,
    hash: transactionHash,
  })
  
  return <FeedbackText status={status}/>
}


const FeedbackText = ({ status }: {status: "error" | "success" | "idle" | "loading"}) => {
  if (status === 'loading') {
    return <p>loading</p>
  } else if (status === 'success') {
    return <p>success</p>
  }

  return <></>
}