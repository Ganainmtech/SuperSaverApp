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
      const appAddress = 'R3BJTS37H37MFD2UEOL6A7YHCGGXJSDV7BKAT3MONOJ4C63A5GJIUIBBFY'

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

  const withdrawFunds = async () => {
    setLoading(true)
    console.log('Withdrawal process started...')

    try {
      // Step 1: Parse the App ID
      const appId = parseInt(appIdInput, 10)
      console.log('Parsed App ID:', appId)

      if (isNaN(appId)) {
        console.error('Invalid App ID. Must be a number.')
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }

      // Step 2: Initialize the app client
      console.log('Initializing app client...')
      const appClient = new SaverClient(getAppDetails(appId), algodClient)

      // Step 3: Call the withdraw method
      console.log('Calling the withdraw method...')
      const withdrawResponse = await appClient.withdraw(
        {}, // No arguments needed for the withdraw ABI
        {
          sender: {
            addr: activeAddress || '',
            signer,
          },
          sendParams: {
            fee: algokit.microAlgos(2000), // Use the MicroAlgos method to create an AlgoAmount
          },
        },
      )

      // Log the response for debugging
      console.log('Withdraw Response:', withdrawResponse)

      showSnackbar('Funds withdrawn successfully!', 'success')
      console.log('Withdraw Response:', withdrawResponse)
    } catch (error) {
      console.error('Error during withdrawal:', error)
      showSnackbar('Error during withdrawal. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-100 to-teal-50">
      <header className="bg-teal-400 text-white py-4 px-8 shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wider">💰 Start Saving</h1>
      </header>

      <main className="flex-grow p-8">
        {/* Opt-In Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-teal-700">Opt Into Your Saver</h2>
          <label className="block mt-4">
            Enter App ID:
            <input
              type="text"
              className="input input-bordered w-full mt-1 rounded-lg border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              placeholder="Enter your app ID"
            />
          </label>
          <button
            className={`btn mt-4 w-full bg-teal-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105 ${
              loading ? 'loading' : ''
            }`}
            onClick={sendAppCall}
            disabled={loading}
          >
            {loading ? 'Opting In...' : 'Opt In'}
          </button>
        </section>

        {/* Set Savings Goal Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto mt-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-teal-700">Set Your Savings Goal</h2>
          <label className="block mt-4">
            Goal Amount:
            <input
              type="text"
              className="input input-bordered w-full mt-1 rounded-lg border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Enter your goal amount"
            />
          </label>
          <button
            className={`btn mt-4 w-full bg-teal-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105 ${
              loading ? 'loading' : ''
            }`}
            onClick={sendGoalTxn}
            disabled={loading}
          >
            {loading ? 'Setting Goal...' : 'Set Goal'}
          </button>
        </section>

        {/* Deposit Funds Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto mt-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-teal-700">Deposit Funds</h2>
          <label className="block mt-4">
            Deposit Amount:
            <input
              type="text"
              className="input input-bordered w-full mt-1 rounded-lg border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              value={depositInput}
              onChange={(e) => setDepositInput(e.target.value)}
              placeholder="Enter deposit amount"
            />
          </label>
          <button
            className={`btn mt-4 w-full bg-teal-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105 ${
              loading ? 'loading' : ''
            }`}
            onClick={depositFunds}
            disabled={loading}
          >
            {loading ? 'Depositing...' : 'Deposit'}
          </button>
        </section>

        {/* Withdraw Funds Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto mt-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-teal-700">Withdraw Funds</h2>
          <p className="text-teal-600 mt-2">Withdraw your savings if you’ve reached or exceeded your goal.</p>
          <button
            className="btn mt-4 w-full bg-teal-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105"
            onClick={withdrawFunds}
          >
            Withdraw
          </button>
        </section>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            className="btn bg-teal-400 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </main>

      <footer className="bg-teal-400 text-white py-4 text-center">
        <p>© 2024 Super Saver App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default StartSaver
