import './styles/App.css'
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from './store';
import { setAccessToken } from './store/authSlice';

import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Library from './pages/Library/Library';
import Categories from './pages/Categories/Categories';
import Section from './pages/Section/Section';
import Playlist from './pages/Playlist/Playlist';
import Album from './pages/Album/Album';
import Artist from './pages/Artist/Artist';
import User from './pages/User/User';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token: authToken, loading } = useSpotifyAuth();
  useSpotifyPlayer(authToken);

  useEffect(() => {
    if (authToken) {
      dispatch(setAccessToken(authToken));
    }
  }, [authToken, dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (!authToken) return <p>Ошибка загрузки токена. Проверь консоль.</p>;

  return (
    <div className="spotify-clone">
      <div className='main'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home token={authToken} />} />
          <Route path='/callback' element={<p>Авторизация прошла успешно! Теперь ты можешь закрыть эту вкладку.</p>} />
          <Route path='/search' element={<Search />} />
          <Route path='/search/:id' element={<Categories />} />
          <Route path='/library' element={<Library />} />
          <Route path='/section/:id' element={<Section />} />
          <Route path='/playlist/:id' element={<Playlist />} />
          <Route path='/album/:id' element={<Album />} />
          <Route path='/artist/:id' element={<Artist />} />
          <Route path='/user/:id' element={<User />} />
        </Routes>
      </div>
      <Player />
    </div>
  )
}

export default App
