import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { SaverClient } from '../contracts/Saver'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const StartSaver = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const indexer = algokit.getAlgoIndexerClient({
    server: indexerConfig.server,
    port: indexerConfig.port,
    token: indexerConfig.token,
  })

  const { enqueueSnackbar } = useSnackbar()
  const { signer, activeAddress } = useWallet()

  const sendAppCall = async () => {
    setLoading(true)

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.

    try {
      const appId = 1007

      const appDetails = {
        resolveBy: 'id',
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
        id: appId,
      } as AppDetails

      console.log('App Details:', appDetails)

      const appClient = new SaverClient(appDetails, algodClient)
      console.log('Created app client:', appClient)

      // Call the optIn method
      const optInResponse = await appClient.optIn
      console.log('Opt-in response:', optInResponse)

      // Now call the 'bare' function to actually opt-in
      const result = await optInResponse.bare()
      console.log('Opt-in result:', result)

      // Handle response logic here
    } catch (error) {
      console.error('Error during opt-in:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Opt into Your Saver Smart Contract</h3>
        <br />
        <button type="button" className={`btn w-full ${loading ? 'loading' : ''}`} onClick={sendAppCall} disabled={loading}>
          {loading ? 'Opting In...' : 'Opt In'}
        </button>
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default StartSaver
