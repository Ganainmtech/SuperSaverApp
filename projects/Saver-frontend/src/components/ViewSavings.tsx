import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SaverClient } from '../contracts/Saver'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const ViewSavings = () => {
  const [goal, setGoal] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const { activeAddress, signer } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })

  const deployedAppID = 740798675

  const getAppDetails = (): AppDetails => ({
    resolveBy: 'id',
    sender: { signer, addr: activeAddress! } as TransactionSignerAccount,
    id: deployedAppID,
  })

  const fetchSavingsData = async () => {
    try {
      const appClient = new SaverClient(getAppDetails(), algodClient)
      const localState = await appClient.getLocalState(activeAddress!)

      const goalVal = localState.userGoal?.asNumber() ?? 0
      const balanceVal = localState.userBalance?.asNumber() ?? 0

      setGoal(goalVal)
      setBalance(balanceVal)
    } catch (error) {
      enqueueSnackbar('Error fetching savings data.', { variant: 'error' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeAddress) {
      fetchSavingsData()
    }
  }, [activeAddress])

  const renderProgressBar = () => {
    if (goal === 0 || goal === null) return null
    const percent = Math.min(Math.round((balance! / goal) * 100), 100)

    return (
      <div className="w-full mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-teal-500 h-4 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm mt-1 text-center text-gray-600">{percent}% of goal reached</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 text-center">
      <h2 className="text-2xl font-semibold text-teal-600 mb-4">Your Savings Overview</h2>

      {loading ? (
        <p>Loading your savings data...</p>
      ) : goal === null || balance === null ? (
        <p>No savings data found. Make sure you've opted into the contract.</p>
      ) : (
        <>
          <p className="text-lg text-gray-700">
            <strong>Goal:</strong> {(goal / 1e6).toFixed(2)} ALGO
          </p>
          <p className="text-lg text-gray-700">
            <strong>Current Savings:</strong> {(balance / 1e6).toFixed(2)} ALGO
          </p>
          {renderProgressBar()}
        </>
      )}

      <button onClick={() => navigate('/')} className="mt-6 py-2 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
        Back to Home
      </button>
    </div>
  )
}

export default ViewSavings
