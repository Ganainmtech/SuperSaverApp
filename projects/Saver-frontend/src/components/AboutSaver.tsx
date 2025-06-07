import { useNavigate } from 'react-router-dom'

const AboutSaver = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 relative overflow-hidden">
        {/* Animated gradient bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-green-400 to-blue-400 animate-pulse" />

        <h1 className="text-4xl font-bold text-teal-600 mb-6 text-center">🌱 About Super Saver</h1>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center">
          Super Saver is a smart savings experience built on the Algorand blockchain. Our mission is simple: help you build better financial
          habits by making saving easy, rewarding, and transparent.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: '🔒 Secure and Decentralized',
              desc: 'Every goal you set and every ALGO you deposit is fully controlled by your wallet. Your data and savings never leave the blockchain.',
            },
            {
              title: '📊 Track Your Progress',
              desc: 'Visual dashboards show you how far you’ve come. Celebrate your wins and get motivated to hit your next milestone.',
            },
            {
              title: '🏆 Hit Your Goals',
              desc: 'Saver encourages consistency. Set a savings goal, deposit at your own pace, and withdraw only when you’ve earned it.',
            },
            {
              title: '🌍 Built on Algorand',
              desc: 'Fast, secure, and eco-friendly — Algorand enables Saver to operate with low fees and high reliability.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-teal-50 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-teal-700 mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button
            onClick={() => navigate('/')}
            className="py-3 px-6 bg-white text-teal-600 border border-teal-500 rounded-lg font-semibold text-lg hover:bg-teal-100 transition-all duration-200"
          >
            🏠 Home Page
          </button>
          <button
            onClick={() => navigate('/StartSuperSaver')}
            className="py-3 px-6 bg-teal-500 text-white rounded-lg font-semibold text-lg hover:bg-teal-600 transition-all duration-200"
          >
            🚀 Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutSaver
