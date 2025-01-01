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
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [appIdInput, setAppIdInput] = useState<string>('')
  const [goalInput, setGoalInput] = useState('')
  const [depositInput, setDepositInput] = useState('')
  const navigate = useNavigate()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

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

  const deployedAppID = 1015
  const appAddress = '2KOUANKJKMEZK4WG5RWKG75DNFVQPK774XDVKVDUEZKW7ERORGIYHLSGDU'

  const sendAppCall = async () => {
    setLoading(true)

    try {
      /*const appId = parseInt(appIdInput, 10)
      if (isNaN(appId)) {
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }*/

      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)

      const optInResponse = await appClient.optIn
      await optInResponse.bare()

      showSnackbar('Successfully opted into the app!', 'success')
    } catch (error) {
      showSnackbar('Error during opt-in. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendGoalTxn = async () => {
    setLoading(true)

    try {
      //const appId = parseInt(appIdInput, 10)
      const goalAmount = parseInt(goalInput, 10)

      if (isNaN(goalAmount) || goalAmount <= 0) {
        showSnackbar('Invalid goal amount. Please enter a valid number.', 'error')
        return
      }

      // Manually convert to microAlgos
      const microAlgosAmount = goalAmount * 1000000

      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)

      const setGoalResponse = await appClient.createSaverJar({ goalAmount: microAlgosAmount })

      showSnackbar('Savings goal set successfully!', 'success')
    } catch (error) {
      showSnackbar('Error during goal setting. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const depositFunds = async () => {
    setLoading(true)

    try {
      //const appId = parseInt(appIdInput, 10)
      const depositAmount = parseInt(depositInput, 10)

      if (isNaN(deployedAppID)) {
        showSnackbar('Invalid App ID. Please enter a valid number.', 'error')
        return
      }

      if (isNaN(depositAmount) || depositAmount <= 0) {
        showSnackbar('Invalid deposit amount. Please enter a valid number.', 'error')
        return
      }

      // Initialize app client
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)

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
    } catch (error) {
      showSnackbar('Error during deposit. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const withdrawFunds = async () => {
    setLoading(true)

    try {
      // Parse the App ID
      //const appId = parseInt(appIdInput, 10)

      // Initialise the app client
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)

      // Call the withdraw method
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

      showSnackbar('Funds withdrawn successfully!', 'success')
    } catch (error) {
      showSnackbar('Error during withdrawal. Check the console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-100 to-teal-50">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-8 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-wider">💰 Start Saving</h1>
          <nav className="flex items-center space-x-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/StartSuperSaver" className="hover:underline">
              Start Saving
            </a>
            <a href="/ViewSavings" className="hover:underline">
              Your Savings
            </a>
            <a href="/about" className="hover:underline">
              About
            </a>
            <button
              className="btn btn-outline btn-sm bg-white text-teal-500 border-teal-500 hover:bg-teal-600 hover:text-white"
              onClick={toggleWalletModal}
            >
              {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow p-6 sm:p-8">
        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Side: Create Saver Jar & Set Goal */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700">Create your Savings Jar</h2>

            {/* Create Saver Jar Section */}
            <button
              className={`btn mt-4 w-full sm:w-72 bg-teal-500 text-white font-semibold py-4 px-6 rounded-xl hover:bg-teal-600 transition-all duration-200`}
              onClick={sendAppCall}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border animate-spin w-6 h-6 border-4 border-white border-t-teal-200 rounded-full" />
              ) : (
                "Create Saver's Jar"
              )}
            </button>
            <p className="mt-4 text-sm text-teal-500 text-center">You are opting into a smart contract for your savings.</p>

            {/* Set Savings Goal Section */}
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700 mt-6">Set Goal</h2>
            <div className="justify-center">
              <label className="block text-center w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6 w-full items-center justify-center">
                  Goal Amount:
                  <input
                    type="text"
                    className="input input-bordered w-full sm:w-48 rounded-lg border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Enter Amount"
                  />
                  <button
                    className={`btn sm:w-32 ml-2 bg-teal-500 text-white font-semibold py-2 rounded-xl hover:bg-teal-600 transition-all duration-200`}
                    onClick={sendGoalTxn}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner-border animate-spin w-6 h-6 border-4 border-white border-t-teal-200 rounded-full" />
                    ) : (
                      'Set Goal'
                    )}
                  </button>
                </div>
              </label>
            </div>
          </div>

          {/* Right Side: Deposit & Withdraw */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700">Deposit Funds</h2>

            {/* Deposit Funds Section */}
            <div className="justify-center">
              <label className="block text-center w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6 w-full items-center justify-center">
                  Deposit Amount:
                  <input
                    type="text"
                    className="input input-bordered w-full sm:w-48 rounded-lg border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    value={depositInput}
                    onChange={(e) => setDepositInput(e.target.value)}
                    placeholder="Enter Amount"
                  />
                  <button
                    className={`btn sm:w-32 ml-2 bg-teal-500 text-white font-semibold py-2 rounded-xl hover:bg-teal-600 transition-all duration-200`}
                    onClick={depositFunds}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner-border animate-spin w-6 h-6 border-4 border-white border-t-teal-200 rounded-full" />
                    ) : (
                      'Deposit'
                    )}
                  </button>
                </div>
              </label>
            </div>

            {/* Withdraw Funds Section */}
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700 mt-6">Withdraw Savings</h2>

            <button
              className="btn mt-4 sm:mt-6 w-full sm:w-72 bg-teal-500 text-white font-semibold py-4 px-6 rounded-xl hover:bg-teal-600 transition-all duration-200"
              onClick={withdrawFunds}
            >
              Withdraw Savings
            </button>
            <p className="mt-4 text-sm text-teal-500 text-center">Withdraw all funds that have reached or exceeded your set goal.</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            className="btn bg-teal-400 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-500 transition-transform"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </main>

      <footer className="bg-teal-400 text-white py-4 text-center mt-10">
        <p>© 2024 Super Saver App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default StartSaver
