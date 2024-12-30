import { useNavigate } from 'react-router-dom'

const ViewSavings = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">View Your Savings</h2>
        <p className="text-center text-gray-600">Your savings details will appear here once you opt-in.</p>
        <div className="mt-6">{/* Placeholder for savings data */}</div>
        <button
          onClick={() => navigate('/')}
          className="py-2 px-4 text-teal-500 border border-teal-500 rounded-md hover:bg-teal-500 hover:text-white transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default ViewSavings
