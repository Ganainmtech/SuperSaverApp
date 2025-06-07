import { useWallet } from '@txnlab/use-wallet'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConnectWallet from './components/ConnectWallet'

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const { activeAddress } = useWallet()
  const navigate = useNavigate()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-8 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Super Saver App</h1>
          <nav className="flex items-center space-x-4">
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

      {/* Main Content */}
      <main className="flex-grow bg-teal-100 py-10">
        <section id="home" className="text-center mb-10">
          <h2 className="text-4xl font-bold text-teal-700">Welcome to Super Saver App</h2>
          <p className="text-teal-600 mt-4">Your journey to reaching financial goals starts here.</p>
        </section>

        {/* Actionable Boxes */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold text-teal-800">Start Saving</h3>
            <p className="text-teal-600 mt-2">Set up your savings goal and start depositing funds.</p>
            <button className="btn btn-primary mt-4 w-full" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold text-teal-800">View Your Savings</h3>
            <p className="text-teal-600 mt-2">Track and manage your savings progress.</p>
            <button className="btn btn-primary mt-4 w-full" onClick={handleViewSavings}>
              View Savings
            </button>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold text-teal-800">Learn More</h3>
            <p className="text-teal-600 mt-2">Discover how the Super Saver App works for you.</p>
            <button className="btn btn-primary mt-4 w-full" onClick={handleViewAboutSaver}>
              Learn More
            </button>
          </div>
        </section>

        {!activeAddress && isFormVisible && <p className="text-center text-red-500 mt-4">Please connect your wallet to continue.</p>}
      </main>

      {/* Footer */}
      <footer className="bg-teal-500 text-white py-4 px-8 text-center">
        <p>© 2024 Super Saver App. All rights reserved.</p>
      </footer>

      {/* Wallet Modal */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default Home
