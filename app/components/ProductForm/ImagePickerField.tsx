// components/ProductForm/ImagePickerField.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../../CSS/ImagePickerField.styles";

interface ImagePickerFieldProps {
  images: string[];
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
      {images.length === 0 ? (
        <TouchableOpacity style={styles.addButton} onPress={onPick}>
          <Text style={styles.addButtonText}>+ Add Image</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.imageContainer}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ImagePickerField;