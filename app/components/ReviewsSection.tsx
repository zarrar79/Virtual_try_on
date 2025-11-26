import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Review } from '../types/product';
import styles from '../CSS/ProductCustomization.styles';

interface ReviewsSectionProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, loading, error }) => {
  if (loading) return <ActivityIndicator size="small" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (reviews.length === 0) return <Text style={styles.noReviewsText}>No reviews yet.</Text>;

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </View>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewerName}>{review.user?.name || "User"}</Text>
    <Text>⭐ {review.rating}/5</Text>
    <Text>{review.comment}</Text>
  </View>
);