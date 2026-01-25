import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import { getUserProfileData } from './services/User/userProfile';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from './store';
import { setAccessToken } from './store/authSlice';
import { setUserProfileData } from './store/userSlice';
import { setNavigation, setNotification } from './store/general';

import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Library from './pages/Library/Library';
import LikedSongs from './pages/LikedSongs/LikedSongs';
import Categories from './pages/Categories/Categories';
import Section from './pages/Section/Section';
import Playlist from './pages/Playlist/Playlist';
import Album from './pages/Album/Album';
import Artist from './pages/Artist/Artist';
import User from './pages/User/User';
import MyProfile from './pages/Profile/MyProfile';
import Notification from './components/common/Notification';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Главный компонент приложения Spotify Clone
// Управляет аутентификацией, маршрутизацией и глобальным состоянием
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Хук управляет полным OAuth-потоком: получает code из URL, обменивает на токен, сохраняет и обновляет его
  const { token: authToken, loading } = useSpotifyAuth(navigate);

  const navigation = useSelector((state: RootState) => state.general.navigation);
  const notification = useSelector((state: RootState) => state.general.notification);

  // Регистрирует приложение как плеер в системе Spotify
  useSpotifyPlayer(authToken);

  // При получении токена сохраняем его в store и загружаем данные профиля пользователя
  useEffect(() => {
    if (!authToken) return;

    dispatch(setAccessToken(authToken));

    // Загружаем информацию о профиле текущего пользователя
    const fetchUserProfileData = async () => {
      try {
        const data = await getUserProfileData(authToken);
        dispatch(setUserProfileData(data));
      } catch (error) {
        console.error(error)
      }
    }
    fetchUserProfileData();
  }, [authToken, dispatch]);
  // Синхронизация текущего пути в Redux store для отслеживания активной страницы
  useEffect(() => {
    dispatch(setNavigation(navigation));
  }, [navigation])

  // Автоматически скрывает уведомление через 3 секунды после появления
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      dispatch(setNotification(null));
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (!authToken) return <p>Ошибка загрузки токена. Проверь консоль.</p>;

  return (
    <div className="spotify-clone">
      <div className='main'>
        <Sidebar />
        {/* Маршруты приложения */}
        <Routes>
          <Route path='/' element={<Home token={authToken} />} />
          <Route path='/search' element={<Search />} />
          <Route path='/search/:id' element={<Categories />} />
          <Route path='/library' element={<Library />} />
          <Route path='/liked-songs' element={<LikedSongs />} />
          <Route path='/section/:id' element={<Section />} />
          <Route path='/playlist/:id' element={<Playlist />} />
          <Route path='/album/:id' element={<Album />} />
          <Route path='/artist/:id' element={<Artist />} />
          <Route path='/user/:id' element={<User />} />
          <Route path='/me' element={<MyProfile />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        {/* Уведомление пользователю */}
        {notification && <Notification message={notification} />}
      </div>
      {/* Плеер для воспроизведения музыки */}
      <Player />
    </div>
  )
}

export default App
