import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";

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

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 8,
    borderRadius: 8,
  },
  placeholderText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

export default ImagePickerField;
