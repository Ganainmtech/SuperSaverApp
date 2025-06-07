import { useWallet } from '@txnlab/use-wallet'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConnectWallet from './components/ConnectWallet'

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const { activeAddress } = useWallet()
  const navigate = useNavigate()

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)

  const handleGetStarted = () => {
    setIsFormVisible(true)
    navigate('/StartSuperSaver')
  }

  const handleViewSavings = () => {
    setIsFormVisible(true)
    navigate('/ViewSavings')
  }

  const handleViewAboutSaver = () => {
    setIsFormVisible(true)
    navigate('/AboutSaver')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-100 to-white">
      {/* Header */}
      <header className="bg-teal-500 text-white py-5 px-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide">Super Saver App</h1>
          <nav className="flex items-center space-x-5">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <a href="/StartSuperSaver" className="hover:underline">
              Start Saving
            </a>
            <a href="/ViewSavings" className="hover:underline">
              Your Savings
            </a>
            <a href="/AboutSaver" className="hover:underline">
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

      <main className="flex-grow bg-gradient-to-b from-teal-50 to-teal-100">
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center text-center py-16 px-4 sm:px-8">
          <h2 className="text-5xl font-bold text-teal-700 leading-tight drop-shadow-sm">
            Your Journey to <span className="text-teal-600">Financial Freedom</span> Begins Now
          </h2>
          <p className="text-teal-600 mt-4 text-lg max-w-2xl">
            Build your savings the smart way — secure, simple, and stress-free with Super Saver.
          </p>
          <button
            className="mt-8 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold shadow-md transition-all"
            onClick={handleGetStarted}
          >
            🚀 Get Started
          </button>
        </section>

        {/* Actionable Sections */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-16 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-teal-800 mb-2">Start Saving</h3>
            <p className="text-teal-600">Set your savings goal and open your personal smart contract vault.</p>
            <button
              className="mt-4 w-full px-5 py-3 bg-emerald-200 hover:bg-emerald-300 text-teal-900 font-semibold rounded-xl shadow-sm transition-all"
              onClick={handleGetStarted}
            >
              🌱 Get Started
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-teal-800 mb-2">View Your Savings</h3>
            <p className="text-teal-600">Keep tabs on your progress and withdraw when you hit your goal.</p>
            <button
              className="mt-4 w-full px-5 py-3 bg-yellow-200 hover:bg-yellow-300 text-teal-900 font-semibold rounded-xl shadow-sm transition-all"
              onClick={handleViewSavings}
            >
              📈 View Savings
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-teal-800 mb-2">Learn More</h3>
            <p className="text-teal-600">Understand how Super Saver empowers smart, goal-based saving.</p>
            <button
              className="mt-4 w-full px-5 py-3 bg-sky-200 hover:bg-sky-300 text-teal-900 font-semibold rounded-xl shadow-sm transition-all"
              onClick={handleViewAboutSaver}
            >
              📘 Learn More
            </button>
          </div>
        </section>

        {!activeAddress && isFormVisible && <p className="text-center text-red-500 mt-4">Please connect your wallet to continue.</p>}
      </main>

      {/* Footer */}
      <footer className="bg-teal-400 text-white py-4 text-center mt-auto">
        <p>© 2024 Super Saver App. All rights reserved.</p>
      </footer>

      {/* Wallet Modal */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default Home
