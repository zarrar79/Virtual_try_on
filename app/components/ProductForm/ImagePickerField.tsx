import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import styles from "../../CSS/ImagePickerField.styles";

interface ImagePickerFieldProps {
  images: { uri: string }[];   // <-- changed from single image to array
  onPick: () => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({ images, onPick }) => {

  const displayUris =
    images?.map((img) =>
      img.uri ? img.uri.replace(/^https?:\/\/[^/]+(:\d+)?/, "") : null
    ) || [];

  const handlePick = () => {
    try {
      onPick();
    } catch (err) {
      console.error("Image pick failed:", err);
      Alert.alert("Error", "Failed to select an image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePick}>
        <Text style={styles.buttonText}>
          {images.length > 0 ? "Add More Images" : "Select Images"}
        </Text>
      </TouchableOpacity>

      {images.length === 0 ? (
        <Text style={styles.placeholderText}>No images selected</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {displayUris.map((uri, index) =>
            uri ? (
              <Image key={index} source={{ uri }} style={[styles.image, { marginRight: 10 }]} />
            ) : null
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ImagePickerField;
