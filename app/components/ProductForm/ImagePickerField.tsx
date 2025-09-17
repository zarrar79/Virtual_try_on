import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const ImagePickerField = ({ image, onPick }) => {
  // If image exists, strip out http://...:5000 part
  const displayUri = image?.uri
    ? image.uri.replace(/^https?:\/\/[^/]+(:\d+)?/, "")
    : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPick}>
        <Text style={styles.buttonText}>
          {image ? "Change Image" : "Select Image"}
        </Text>
      </TouchableOpacity>

      {displayUri && <Image source={{uri: `${displayUri}`}} style={styles.image} />}
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
});

export default ImagePickerField;
