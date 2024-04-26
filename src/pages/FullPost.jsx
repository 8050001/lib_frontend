import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 
import axios from '../axios';
import ReactMarkdown from 'react-markdown';
import { Post } from '../components/Post';

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams(); // 

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Помилка при отриманні книги');
      });
  }, [id]);



  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        // imageUrl='http://localhost:4444/uploads/1.png'
        // imageUrl={data.imageUrl}
        imageUrl={`http://localhost:4444/${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
        isEditable={true}
        isLoading={isLoading}
        
      >
        <ReactMarkdown children={data.text} />
      </Post>
    </>
  );
};
