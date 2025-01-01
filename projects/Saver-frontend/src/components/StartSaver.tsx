import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SaverClient } from '../contracts/Saver'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const StartSaver = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [appIdInput, setAppIdInput] = useState<string>('')
  const [goalInput, setGoalInput] = useState('')
  const [depositInput, setDepositInput] = useState('')
  const navigate = useNavigate()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })

  const { enqueueSnackbar } = useSnackbar()
  const { signer, activeAddress } = useWallet()

  const getAppDetails = (appId: number): AppDetails => ({
    resolveBy: 'id',
    sender: { signer, addr: activeAddress } as TransactionSignerAccount,
    id: appId,
  })

  const showSnackbar = (message: string, variant: 'success' | 'error') => {
    enqueueSnackbar(message, { variant })
  }

  const sendAppCall = async () => {
    setLoading(true)

    try {
      const appId = parseInt(appIdInput, 10)
      if (isNaN(appId)) {
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }

      const appClient = new SaverClient(getAppDetails(appId), algodClient)

      const optInResponse = await appClient.optIn
      await optInResponse.bare()

      showSnackbar('Successfully opted into the app!', 'success')
    } catch (error) {
      console.error('Error during opt-in:', error)
      showSnackbar('Error during opt-in. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendGoalTxn = async () => {
    setLoading(true)

    try {
      const appId = parseInt(appIdInput, 10)
      const goalAmount = parseInt(goalInput, 10)

      if (isNaN(appId)) {
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }

      if (isNaN(goalAmount) || goalAmount <= 0) {
        showSnackbar('Invalid goal amount. Please enter a valid number.', 'error')
        return
      }

      const appClient = new SaverClient(getAppDetails(appId), algodClient)

      const setGoalResponse = await appClient.createSaverJar({ goalAmount })

      showSnackbar('Savings goal set successfully!', 'success')
      console.log('Set Goal Response:', setGoalResponse)
    } catch (error) {
      console.error('Error during goal setting:', error)
      showSnackbar('Error during goal setting. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const depositFunds = async () => {
    setLoading(true)

    try {
      const appId = parseInt(appIdInput, 10)
      const depositAmount = parseInt(depositInput, 10)

      if (isNaN(appId)) {
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }

      if (isNaN(depositAmount) || depositAmount <= 0) {
        showSnackbar('Invalid deposit amount. Please enter a valid number.', 'error')
        return
      }

      // Initialize app client
      const appClient = new SaverClient(getAppDetails(appId), algodClient)
      const appAddress = 'OKSDOCOXVGMBXQ5TP5YA4VWTZWZJLJP3OMIILPHMHGHURUFE2Q3JP62QNU'

      // Create the payment transaction
      const paymentTxn = await algokit.transferAlgos(
        {
          from: {
            addr: activeAddress || '', // Sender's address and fallback (left blank for now)
            signer, // Signer for the transaction
          },
          to: appAddress, // App contract address
          amount: algokit.algos(depositAmount), // Deposit amount
          skipSending: true, // Do not send immediately
        },
        algodClient,
      )

      // Call the deposit method
      const depositResponse = await appClient.deposit(
        {
          depositTxn: paymentTxn.transaction, // Pass the payment transaction using the correct argument name
        },
        {
          sender: {
            addr: activeAddress || '', // Sender's address and fallback (left blank for now)
            signer, // Signer for the transaction
          },
        },
      )

      showSnackbar('Funds deposited successfully!', 'success')
      console.log('Deposit Response:', depositResponse)
    } catch (error) {
      console.error('Error during deposit:', error)
      showSnackbar('Error during deposit. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-100">
      <header className="bg-teal-500 text-white py-4 px-8 shadow-md">
        <h1 className="text-2xl font-bold">Start Saving</h1>
      </header>

      <main className="flex-grow p-8">
        <section className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold text-teal-800">Opt Into Your Saver</h2>
          <label className="block mt-4">
            Enter App ID:
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              placeholder="Enter your app ID"
            />
          </label>
          <button className={`btn btn-primary mt-4 w-full ${loading ? 'loading' : ''}`} onClick={sendAppCall} disabled={loading}>
            {loading ? 'Opting In...' : 'Opt In'}
          </button>
        </section>

        <section className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold text-teal-800">Set Your Savings Goal</h2>
          <label className="block mt-4">
            Goal Amount:
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Enter your goal amount"
            />
          </label>
          <button className={`btn btn-primary mt-4 w-full ${loading ? 'loading' : ''}`} onClick={sendGoalTxn} disabled={loading}>
            {loading ? 'Setting Goal...' : 'Set Goal'}
          </button>
        </section>

        <section className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold text-teal-800">Deposit Funds</h2>
          <label className="block mt-4">
            Deposit Amount:
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={depositInput}
              onChange={(e) => setDepositInput(e.target.value)}
              placeholder="Enter deposit amount"
            />
          </label>
          <button className={`btn btn-primary mt-4 w-full ${loading ? 'loading' : ''}`} onClick={depositFunds} disabled={loading}>
            {loading ? 'Depositing...' : 'Deposit'}
          </button>
        </section>

        <div className="text-center mt-6">
          <button className="btn bg-teal-500 text-white hover:bg-teal-600" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </main>

      <footer className="bg-teal-500 text-white py-4 text-center">
        <p>© 2024 Super Saver App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default StartSaver
