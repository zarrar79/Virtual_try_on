import { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { View, Text, FlatList, Pressable } from "react-native";
import styles from "../CSS/Review.styles";

interface Review {
  _id: string;
  user: { name: string };
  product: { name: string };
  rating: number;
  comment: string;
}

const ReviewsList = () => {
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

  // 🧩 Split reviews into columns (e.g., 3 columns)
  const numColumns = 4;
  const columnData = Array.from({ length: numColumns }, (_, colIndex) =>
    reviews.filter((_, i) => i % numColumns === colIndex)
  );

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingBottom: 50,
      }}
    >
      {columnData.map((column, colIndex) => (
        <View key={colIndex} style={{ flex: 1, gap: 3 }}>
          {column.map((item) => (
            <Pressable
              key={item._id}
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
          ))}
        </View>
      ))}
    </View>
  );
};

export default ReviewsList;
