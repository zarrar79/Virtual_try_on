import { View, Text, TouchableOpacity, Image ,Alert } from "react-native";
import styles from "../../CSS/ImagePickerField.styles";

interface ImagePickerFieldProps {
  image: { uri: string } | null;
  onPick: () => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({ image, onPick }) => {
  const displayUri = image?.uri ? image.uri.replace(/^https?:\/\/[^/]+(:\d+)?/, "") : null;

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
          {image ? "Change Image" : "Select Image"}
        </Text>
      </TouchableOpacity>

      {displayUri ? (
        <Image source={{ uri: displayUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>No image selected</Text>
      )}
    </View>
  );
};

export default ImagePickerField;
