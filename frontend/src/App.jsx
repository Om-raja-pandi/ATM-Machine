import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegionSelect from './pages/RegionSelect';
import Menu from './pages/Menu';
import Withdraw from './pages/Withdraw';
import Deposit from './pages/Deposit';
import MiniStatement from './pages/MiniStatement';
import Balance from './pages/Balance';
import PinChange from './pages/PinChange';
import Exit from './pages/Exit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/region" element={<RegionSelect />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/mini-statement" element={<MiniStatement />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/pin-change" element={<PinChange />} />
        <Route path="/exit" element={<Exit />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;