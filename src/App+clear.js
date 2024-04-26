import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import React from 'react';
import { Header } from './components/index.js';
import { Home, FullPost, Registration, AddPost, Login } from './pages/index.js';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth.js';
import axios from './axios.js'; // импортируем axios

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  // Функция для обработки перехода на /clear_updates
  const handleClearUpdates = async () => {
    try {
      // Отправляем GET запрос на бэкенд
      const response = await axios.get('/clear_uploads');
      // Выводим сообщение об успешном выполнении операции
      console.log(response.data);
    } catch (error) {
      // Выводим сообщение об ошибке, если что-то пошло не так
      console.error('Ошибка при очистке обновлений:', error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          {/* Добавляем обработчик для маршрута /clear_updates */}
          <Route
            path="/clear_uploads"
            element={<Navigate to="/" replace />}
            // Выполняем функцию handleClearUpdates при переходе на /clear_updates
            onEnter={handleClearUpdates}
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
