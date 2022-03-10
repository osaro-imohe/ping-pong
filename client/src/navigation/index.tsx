import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Game from '../pages/game';
import Home from '../pages/home';

const Navigation = () => (
  <BrowserRouter>
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route
        path="*"
        element={<Navigate to="" />}
      />
    </Routes>
  </BrowserRouter>
);

export default Navigation;
