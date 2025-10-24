// ReviewsList component

import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { View, Text } from "react-native";

 interface ReviewsListProps {
  styles: any; // ✅ styles will be passed as prop
}

interface Review {
  _id: string;
  user: { name: string };
  product: { name: string };
  rating: number;
  comment: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ styles }) => {
  const BASE_URL = useApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/all-reviews`); // replace with your backend API
        const data = await res.json();
        console.log(data,'---->data');
        
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>Loading reviews...</Text>;

  if (reviews.length === 0) return <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>No reviews yet.</Text>;

  return (
    <View style={{ marginTop: 20, paddingBottom: 50 }}>
      {reviews.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <Text style={styles.reviewText}><Text style={{ fontWeight: "bold" }}>Customer:</Text> {review.user.name}</Text>
          <Text style={styles.reviewText}><Text style={{ fontWeight: "bold" }}>Product:</Text> {review.product?.name}</Text>
          <Text style={styles.reviewText}><Text style={{ fontWeight: "bold" }}>Rating:</Text> {review.rating} ★</Text>
          <Text style={styles.reviewText}><Text style={{ fontWeight: "bold" }}>Comment:</Text> {review.comment || "No comment"}</Text>
        </View>
      ))}
    </View>
  );
};

export default ReviewsList;