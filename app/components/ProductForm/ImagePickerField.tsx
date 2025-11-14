// components/ProductForm/ImagePickerField.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../../CSS/ImagePickerField.styles";

interface ImagePickerFieldProps {
  images: { uri: string }[];
  onPick: () => void;
  onRemove: (index: number) => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  images,
  onPick,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPick}>
        <Text style={styles.buttonText}>
          {images.length > 0 ? "Add More Images" : "Select Images"}
        </Text>
      </TouchableOpacity>

      {images.length === 0 ? (
        <Text style={styles.placeholderText}>No images selected</Text>
      ) : (
        <View style={styles.imageContainer}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
              >
                <Text style={styles.removeText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ImagePickerField;
