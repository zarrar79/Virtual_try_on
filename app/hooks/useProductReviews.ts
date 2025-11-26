import { useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from '../context/ApiContext';
import { Review } from '../types/product';

export const useProductReviews = (productId: string) => {
  const BASE_URL = useApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/review/product/${productId}`);
        setReviews(response.data);
      } catch (err: any) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId, BASE_URL]);

  return { reviews, loading, error };
};