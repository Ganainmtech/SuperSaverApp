import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SaverClient } from '../contracts/Saver'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const StartSaver = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [depositInput, setDepositInput] = useState('')
  const [alreadyOptedIn, setAlreadyOptedIn] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<number | null>(null)
  const [currentBalance, setCurrentBalance] = useState<number | null>(null)

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner } = useWallet()
  const signer = transactionSigner

  const deployedAppID = 740800501n
  const appAddress = 'NSBKY7G5NNYVF2BKIJL6MAJ4QW6PZSDFMGNQ3EDULAKHBWX2MPK6YZLS2A'
  const algodClient = algokit.getAlgoClient(getAlgodConfigFromViteEnvironment())

  const getAppDetails = (appId: bigint): AppDetails => {
    console.log('[AppDetails] Active address:', activeAddress)
    return {
      resolveBy: 'id',
      sender: { signer, addr: activeAddress! } as TransactionSignerAccount,
      id: Number(appId),
    }
  }

  const showSnackbar = (message: string, variant: 'success' | 'error') => {
    enqueueSnackbar(message, { variant })
  }

  const refreshState = async () => {
    if (!activeAddress) return
    try {
      const accountInfo = await algodClient.accountInformation(activeAddress).do()
      const appLocalState = accountInfo.appsLocalState?.find((app) => app.id === deployedAppID)
      const keyValue = appLocalState?.keyValue || []

      const getUintValue = (key: string) => {
        const entry = keyValue.find((kv: any) => {
          const decodedKey = Buffer.from(kv.key, 'base64').toString()
          return decodedKey === key
        })
        return entry ? Number(entry.value.uint) : 0
      }

      setAlreadyOptedIn(true)
      setCurrentGoal(getUintValue('user_goal'))
      setCurrentBalance(getUintValue('user_balance'))
    } catch (err) {
      console.error('[refreshState] Failed to get local state:', err)
      setAlreadyOptedIn(false)
      setCurrentGoal(null)
      setCurrentBalance(null)
    }
  }

  useEffect(() => {
    console.log('[useEffect] activeAddress changed:', activeAddress)
    refreshState()
  }, [activeAddress])

  const sendAppCall = async () => {
    if (!activeAddress) return showSnackbar('Connect your wallet first.', 'error')
    setLoading(true)
    try {
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)
      const optInResponse = await appClient.optIn
      await optInResponse.bare()
      showSnackbar('Successfully opted into the app!', 'success')
      await refreshState()
    } catch (err) {
      console.error('[sendAppCall] Error:', err)
      showSnackbar('Error during opt-in.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendGoalTxn = async () => {
    if (!activeAddress) return showSnackbar('Connect your wallet first.', 'error')
    setLoading(true)
    try {
      const goalAmount = parseInt(goalInput, 10)
      if (isNaN(goalAmount) || goalAmount <= 0) {
        showSnackbar('Invalid goal amount.', 'error')
        return
      }
      const microAlgos = goalAmount * 1_000_000
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)
      await appClient.createSaverJar({ goalAmount: microAlgos })
      showSnackbar('Savings goal set!', 'success')
      await refreshState()
    } catch (err) {
      console.error('[sendGoalTxn] Error:', err)
      showSnackbar('Error setting goal.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const depositFunds = async () => {
    if (!activeAddress) return showSnackbar('Connect your wallet first.', 'error')
    setLoading(true)
    try {
      const amount = parseInt(depositInput, 10)
      if (isNaN(amount) || amount <= 0) {
        showSnackbar('Invalid deposit amount.', 'error')
        return
      }
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)
      const paymentTxn = await algokit.transferAlgos(
        {
          from: { addr: activeAddress, signer },
          to: appAddress,
          amount: algokit.algos(amount),
          skipSending: true,
        },
        algodClient,
      )
      await appClient.deposit({ depositTxn: paymentTxn.transaction }, { sender: { addr: activeAddress, signer } })
      showSnackbar('Deposit successful!', 'success')
      await refreshState()
    } catch (err) {
      console.error('[depositFunds] Error:', err)
      showSnackbar('Error during deposit.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const withdrawFunds = async () => {
    if (!activeAddress) return showSnackbar('Connect your wallet first.', 'error')
    setLoading(true)
    try {
      const appClient = new SaverClient(getAppDetails(deployedAppID), algodClient)
      await appClient.withdraw(
        {},
        {
          sender: { addr: activeAddress, signer },
          sendParams: { fee: algokit.microAlgos(2000) },
        },
      )
      showSnackbar('Withdrawal complete!', 'success')
      await refreshState()
    } catch (err) {
      console.error('[withdrawFunds] Error:', err)
      showSnackbar('Error during withdrawal.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = currentGoal && currentBalance ? Math.min(Math.round((currentBalance / currentGoal) * 100), 100) : 0
  const progressColor = progressPercent >= 100 ? 'bg-green-500' : 'bg-blue-400'

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white py-10 px-6">
      <div className="relative max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-green-400 to-blue-400 animate-pulse rounded-t-2xl" />

        <h1 className="text-4xl font-bold text-teal-600 mb-6 text-center">🚀 Start Your Savings Journey</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-teal-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4">🔐 Create Saver Jar</h2>
            <button
              onClick={sendAppCall}
              disabled={alreadyOptedIn || loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                alreadyOptedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              {alreadyOptedIn ? 'Jar Already Created' : loading ? 'Processing...' : "Create Saver's Jar"}
            </button>
            <p className="text-sm text-teal-600 mt-4 text-center">Opt your wallet into the smart savings contract.</p>

            <h3 className="text-lg font-medium text-teal-700 mt-6">🎯 Set a Goal</h3>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. 10 ALGO"
                className="input input-bordered w-full rounded-md border-teal-300"
              />
              <button
                onClick={sendGoalTxn}
                disabled={loading || (currentBalance || 0) > 0}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  (currentBalance || 0) > 0 ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                {loading ? '...' : 'Set Goal'}
              </button>
            </div>
            {(currentBalance || 0) > 0 && (
              <p className="text-sm text-red-500 mt-2 text-center">You can't change your goal after depositing.</p>
            )}
          </div>

          <div className="bg-teal-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4">💸 Manage Funds</h2>

            {currentGoal !== null && currentBalance !== null && (
              <div className="flex justify-between text-sm text-teal-700 mb-4">
                <p>
                  🎯 Current Goal: <strong>{(currentGoal / 1e6).toFixed(2)} ALGO</strong>
                </p>
                <p>
                  💰 Current Savings: <strong>{(currentBalance / 1e6).toFixed(2)} ALGO</strong>
                </p>
              </div>
            )}

            <h3 className="text-lg font-medium text-teal-700">Deposit</h3>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={depositInput}
                onChange={(e) => setDepositInput(e.target.value)}
                placeholder="e.g. 5 ALGO"
                className="input input-bordered w-full rounded-md border-teal-300"
              />
              <button
                onClick={depositFunds}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold"
              >
                {loading ? '...' : 'Deposit'}
              </button>
            </div>

            <h3 className="text-lg font-medium text-teal-700 mt-6">Withdraw</h3>
            <button
              onClick={withdrawFunds}
              className={`mt-3 w-full py-3 rounded-xl text-white font-semibold transition ${
                currentBalance !== null && currentGoal !== null && currentBalance >= currentGoal
                  ? 'bg-teal-500 animate-pulse hover:bg-teal-600'
                  : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              Withdraw Funds
            </button>
            <p className="text-sm text-teal-600 mt-4 text-center">Withdraw once you've hit your savings goal.</p>
          </div>
        </div>

        {currentGoal && currentBalance !== null && (
          <div className="mt-10">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className={`${progressColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-sm mt-1 text-center text-gray-600">{progressPercent}% of goal reached</p>
          </div>
        )}

        <div className="text-center mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold">
            ⬅ Back to Home
          </button>
          <button
            onClick={() => navigate('/ViewSavings')}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
          >
            📈 View Savings
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartSaver
