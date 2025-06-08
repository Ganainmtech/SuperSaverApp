import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { WalletButton, WalletUIProvider } from '@txnlab/use-wallet-ui-react'
import '@txnlab/use-wallet-ui-react/dist/style.css'

import { SnackbarProvider } from 'notistack'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Home from './Home'
import AboutSaver from './components/AboutSaver'
import StartSaver from './components/StartSaver'
import ViewSavings from './components/ViewSavings'

const walletManager = new WalletManager({
  wallets: [WalletId.PERA, WalletId.DEFLY, WalletId.EXODUS],
  defaultNetwork: NetworkId.TESTNET,
})

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <WalletUIProvider>
          <Router>
            {/* Wallet Connect Button (top right corner) */}
            <div data-wallet-ui style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
              <WalletButton />
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/StartSuperSaver" element={<StartSaver openModal={true} setModalState={() => {}} />} />
              <Route path="/ViewSavings" element={<ViewSavings />} />
              <Route path="/AboutSaver" element={<AboutSaver />} />
            </Routes>
          </Router>
        </WalletUIProvider>
      </WalletProvider>
    </SnackbarProvider>
  )
}
