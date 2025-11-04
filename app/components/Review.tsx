import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { View, Text, FlatList, Pressable } from "react-native";

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
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/all-reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading)
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
        Loading reviews...
      </Text>
    );

  if (reviews.length === 0)
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
        No reviews yet.
      </Text>
    );

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item._id}
      numColumns={3}
      columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
      contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <Pressable
          onPressIn={() => setHovered(item._id)}
          onPressOut={() => setHovered(null)}
          style={[
            styles.reviewCard,
            hovered === item._id && styles.reviewCardHover,
          ]}
        >
          <Text style={styles.reviewTitle}>{item.product?.name}</Text>

          <View style={styles.reviewMeta}>
            <Text style={styles.reviewAuthor}>👤 {item.user.name}</Text>
            <Text style={styles.reviewRating}>
              ⭐ {item.rating.toFixed(1)} / 5
            </Text>
          </View>

          <Text style={styles.reviewComment}>
            {item.comment || "No comment provided."}
          </Text>
        </Pressable>
      )}
    />
  );
};

export default ReviewsList;
