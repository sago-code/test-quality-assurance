import { useStorage } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { validJson } from '../lib';

export function Root() {
  const storage = useStorage();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const session = storage.get('session');

      if (!session || !validJson(session)) {
        navigate('/login');
      } else {
        navigate('/posts');
      }
    } catch (error) {
      console.error('Storage error:', error);
      navigate('/login');
    }
  }, [storage, navigate]);

  return <>Redirecting you...</>;
}

export default Root;
