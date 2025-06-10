import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SaverClient } from '../contracts/Saver'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const ViewSavings = () => {
  const [goal, setGoal] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [withdrawCount, setWithdrawCount] = useState<number | null>(null)
  const [totalSaved, setTotalSaved] = useState<number | null>(null)
  const [lastGoal, setLastGoal] = useState<number | null>(null)
  const [lastWithdrawn, setLastWithdrawn] = useState<number | null>(null)
  const [lastWithdrawTime, setLastWithdrawTime] = useState<number | null>(null)
  const [highestGoal, setHighestGoal] = useState<number | null>(null)
  const [avgDeposit, setAvgDeposit] = useState<number | null>(null)
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

  const deployedAppID = 740800501

  const getAppDetails = (): AppDetails => ({
    resolveBy: 'id',
    sender: { signer, addr: activeAddress! } as TransactionSignerAccount,
    id: deployedAppID,
  })

  const fetchSavingsData = async () => {
    try {
      const appClient = new SaverClient(getAppDetails(), algodClient)
      const localState = await appClient.getLocalState(activeAddress!)

      setGoal(localState.userGoal?.asNumber() ?? 0)
      setBalance(localState.userBalance?.asNumber() ?? 0)
      setWithdrawCount(localState.userWithdrawCount?.asNumber() ?? 0)
      setTotalSaved(localState.totalSaved?.asNumber() ?? 0)
      setLastGoal(localState.lastUserGoal?.asNumber() ?? 0)
      setLastWithdrawn(localState.lastWithdrawn?.asNumber() ?? 0)
      setLastWithdrawTime(localState.lastWithdrawTime?.asNumber() ?? 0)
      setHighestGoal(localState.highestGoalAchieved?.asNumber() ?? 0)
      setAvgDeposit(localState.averageDepositAmount?.asNumber() ?? 0)
    } catch (error) {
      enqueueSnackbar('Error fetching savings data.', { variant: 'error' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeAddress) fetchSavingsData()
  }, [activeAddress])

  const renderChart = (label: string, value: number) => (
    <div className="bg-gray-50 p-4 rounded-xl shadow">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={[{ name: label, amount: value / 1e6 }]}>
          {' '}
          {/* value converted from microalgos */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        {label}: {(value / 1e6).toFixed(2)} ALGO
      </p>
    </div>
  )

  return (
    <div className="relative max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 text-center overflow-hidden">
      {/* Animated top bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-green-400 to-blue-400 animate-pulse rounded-t-2xl" />

      <h2 className="text-3xl font-bold text-teal-600 mb-6">💡 Your Savings Dashboard</h2>

      {loading ? (
        <p>Loading your savings data...</p>
      ) : goal === null || balance === null ? (
        <p>No savings data found. Make sure you've opted into the contract.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-teal-50 p-6 rounded-xl shadow">
              <p className="text-teal-800 text-lg">
                🎯 <strong>Current Goal:</strong> {(goal / 1e6).toFixed(2)} ALGO
              </p>
              <p className="text-teal-800 text-lg mt-2">
                💰 <strong>Savings:</strong> {(balance / 1e6).toFixed(2)} ALGO
              </p>
              <p className="text-teal-800 text-lg mt-2">
                🏆 <strong>Completed Goals:</strong> {withdrawCount}
              </p>
              <p className="text-teal-800 text-lg mt-2">
                📈 <strong>Highest Goal:</strong> {(highestGoal! / 1e6).toFixed(2)} ALGO
              </p>
              <p className="text-teal-800 text-lg mt-2">
                📊 <strong>Average Deposit:</strong> {(avgDeposit! / 1e6).toFixed(2)} ALGO
              </p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-teal-500 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.round((balance! / goal!) * 100), 100)}%`,
                    }}
                  />
                </div>
                <p className="text-sm mt-1 text-center text-gray-600">
                  {Math.min(Math.round((balance! / goal!) * 100), 100)}% of goal reached
                </p>
              </div>
            </div>

            <div className="text-sm text-left p-4 bg-gray-50 rounded-xl shadow">
              <p>
                🕒 <strong>Last Goal:</strong> {(lastGoal! / 1e6).toFixed(2)} ALGO
              </p>
              <p className="mt-2">
                💸 <strong>Last Withdraw:</strong> {(lastWithdrawn! / 1e6).toFixed(2)} ALGO
              </p>
              <p className="mt-2">
                📆 <strong>Last Withdraw Time:</strong> {lastWithdrawTime ? new Date(lastWithdrawTime * 1000).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {renderChart('Current Goal', goal!)}
            {renderChart('Total Saved', totalSaved!)}
            {renderChart('Highest Goal', highestGoal!)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderChart('Average Deposit', avgDeposit!)}
            {renderChart('Last Goal', lastGoal!)}
            {renderChart('Last Withdraw', lastWithdrawn!)}
          </div>
        </>
      )}

      <button onClick={() => navigate('/')} className="mt-8 py-2 px-6 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
        ⬅️ Back to Home
      </button>
    </div>
  )
}

export default ViewSavings
