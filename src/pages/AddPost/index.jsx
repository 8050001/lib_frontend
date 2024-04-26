import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');
  const inputFileRef = React.useRef(null);
  const inputImageFileRef= React.useRef(null);////

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    // console.log(event.target.files)
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file); 
      const { data } = await axios.post('/uploads', formData);
      setImageUrl(data.url); 
    } catch (err) {
      console.warn(err);
      alert('Помилка при загрузці файлу!');
    }
  };

  const handleImageChangeFile = async (event) => {
    // console.log(event.target.files)
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file); //'image' => 'file'
      const { data } = await axios.post('/uploads', formData);
      setFileUrl(data.url); //setImageUrl => setFileUrl
    } catch (err) {
      console.warn(err);
      alert('Помилка при загрузці файлу!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      let textWithFileUrl = text;
      if (fileUrl) {
      // textWithFileUrl += `\nСсылка на файл: ${fileUrl}`;
      textWithFileUrl += `\n[ФАЙЛ:](${"http://localhost:4444/"}${fileUrl})`;
      
      }


      const fields = {
        title,
        imageUrl,
        tags,
        text: textWithFileUrl,
        // text: `${text}\n\nСсылка на файл: ${fileUrl}`,
        // text: `${text}\n\nСсылка на файл: ${imageUrl}`,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Помилка при створенні книги!');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Помилка при отриманні книги!');
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введіть текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузити превью
      </Button>
      <Button onClick={() => inputImageFileRef.current.click()} variant="outlined" size="large">
        Загрузити файл
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      <input ref={inputImageFileRef} type="file" onChange={handleImageChangeFile} hidden /> {/* Добавлено */}
      {/* Показуємо посилання на файл якщо вона є */}
      {fileUrl && (
          <p>Посилання на загружений файл: <a href={fileUrl}>{fileUrl}</a></p>
      )}
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Видалити
          </Button>
          <img
            className={styles.image}
            src={`${"http://localhost:4444/"}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        // value={fields.title}
        // onChange={(e) => setFieldValue('title', e.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок ..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Теги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Зберегти' : 'Опублікувати'}
        </Button>
        <a href="/">
          <Button size="large">Відміна</Button>
        </a>
      </div>
    </Paper>
  );
};
