import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blog_data, assets, comments_data } from '../assets/assets';
import moment from 'moment';
import Loader from '../components/Loader';

function Blog() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const blog = blog_data.find(item => item._id === id);
    setData(blog || null);

    const updatedComments = comments_data.map(comment => ({
      ...comment,
      createdAt: comment.createdAt || new Date()
    }));
    setComments(updatedComments);
  }, [id]);

  const addComment = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newComment = {
      name,
      content,
      createdAt: new Date()
    };

    setComments(prev => [newComment, ...prev]);
    setName('');
    setContent('');
  };

  if (!data) return <Loader />;

  return (
    <div className='relative'>
      <img
        src={assets.gradientBackground}
        alt="Background gradient"
        className='absolute -top-[50px] z-[-1] opacity-50'
      />

      {/* Blog Header */}
      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>
          Published On {moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>
          {data.author || 'Michel Brown'}
        </p>
      </div>

      {/* Blog Content */}
      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt={data.title} className='rounded-3xl mb-5' />
        <div
          className='rich-text max-w-3xl mx-auto'
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        {/* Comments Section */}
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.map((item, index) => (
              <div
                key={index}
                className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="User icon" className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your Comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input
              type='text'
              placeholder='Name'
              className='w-full p-2 border border-gray-300 rounded outline-none'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder='Comment'
              className='w-full p-2 border border-gray-300 rounded outline-none h-48'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className='bg-primary text-white rounded p-3 px-8 hover:scale-105 transition-all cursor-pointer'
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Blog;
