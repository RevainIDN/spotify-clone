import './styles/App.css'
import { Routes, Route } from 'react-router-dom';
import { useSpotifyToken } from './hooks/useSpotifyToken';
import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';

function App() {
  const { token, isLoading, isError } = useSpotifyToken();

  if (isLoading) return <p>Загрузка токена Spotify...</p>;
  if (isError || !token) return <p>Ошибка загрузки токена. Проверь консоль.</p>;

  return (
    <div className="spotify-clone">
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home token={token} />} />
        <Route path='/search' element={<Search />} />
      </Routes>
      <Player />
    </div>
  )
}

export default App
