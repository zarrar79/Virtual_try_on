import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1f1f1f",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        width: "45%",
        marginTop: 25,
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    inputWrapper: {
        marginBottom: 12,
    },
    label: {
        color: "#D1D5DB", // gray-300
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#27272a",
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 15,
        borderColor: "#10B981",
    },
    description: {
        height: 80,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#10B981",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    submitButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 12,
        alignItems: "center",
    },
    cancelText: {
        color: "#f87171",
        fontSize: 14,
    },
    // Add these to your existing styles
designsSection: {
  marginTop: 20,
  marginBottom: 20,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  color: "#D1D5DB",
},
designContainer: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#e0e0e0',
},
designTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 10,
  color: "#D1D5DB",
},
designImageSection: {
  marginBottom: 15,
},
designLabel: {
  fontSize: 14,
  fontWeight: '500',
  marginBottom: 8,
  color: "#D1D5DB",
},
mainImagesSection: {
  marginTop: 20,
  marginBottom: 20,
},
hintText: {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
  fontStyle: 'italic',
},
  designCard: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#10B981",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  singleImageContainer: {
    alignItems: 'center',
  },
  designImageWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  designImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  addImageText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  removeDesignButton: {
  backgroundColor: '#e74c3c',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},
removeDesignText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '500',
},
disabledInput: {
  cursor: 'not-allowed',
},
sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
},

// Add design button
addDesignButton: {
  backgroundColor: '#27ae60',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
  alignSelf: 'flex-start',
},
addDesignButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '500',
},
removedDesignCard: {
  backgroundColor: '#f8f9fa',
  borderColor: '#dc3545',
  opacity: 0.6,
},
removedDesignText: {
  color: '#6c757d',
  textDecorationLine: 'line-through',
},

// Design actions
designTitleContainer: {
  flex: 1,
},
designActions: {
//   flexDirection: 'row',
  gap: 8,
},

// Restore button
restoreDesignButton: {
  backgroundColor: '#28a745',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},
restoreDesignText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '500',
},
designInputWrapper: {
    marginBottom: 20,
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  stockCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  inStock: {
    color: '#2e7d32',
  },
  outOfStock: {
    color: '#d32f2f',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    // backgroundColor: 'white',
    height: 50,
  },
  inputInStock: {
    borderColor: '#4CAF50',
  },
  inputOutOfStock: {
    borderColor: '#ddd',
  },
  designInput: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: "#10B981",
    borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  inputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  stockIcon: {
    padding: 4,
  },
  stockIconText: {
    fontSize: 16,
  },
  stockLevelContainer: {
    marginTop: 12,
  },
  stockLevelBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  stockLevelFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'all 0.3s ease',
  },
  stockLevelText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  designHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default styles;