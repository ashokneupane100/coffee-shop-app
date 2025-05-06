import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Cafe data (replace with actual data)
const cafeData = {
  name: "Onlinehome Cafe",
  description:
    "A cozy cafe in front of Kalanki Malpot, serving delicious coffee, pastries, and Nepali delicacies.",
  address: "Kalanki, Kathmandu, Nepal 44600",
  hours: "7:00 AM - 9:00 PM",
  contact: "+97715234567",
  email: "kalankicafe@gmail.com",
};

// Placeholder images (replace with actual photos)
const defaultImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f71?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1350&q=80",
];

export default function Explore() {
  const router = useRouter();
  const [images, setImages] = useState(defaultImages);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "Please allow access to photos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
  );

  const openContact = (type) => {
    Linking.openURL(type === "phone" ? `tel:${cafeData.contact}` : `mailto:${cafeData.email}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image source={{ uri: defaultImages[0] }} style={styles.logo} />
        <Text style={styles.cafeName}>{cafeData.name}</Text>
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          data={images}
          renderItem={renderImage}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          style={styles.carousel}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.uploadButtonText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.description}>{cafeData.description}</Text>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>{cafeData.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>{cafeData.hours}</Text>
        </View>
        <TouchableOpacity onPress={() => openContact("phone")} style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#007AFF" />
          <Text style={[styles.infoText, styles.link]}>{cafeData.contact}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openContact("email")} style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#007AFF" />
          <Text style={[styles.infoText, styles.link]}>{cafeData.email}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/create-product")}
        >
          <Text style={styles.buttonText}>Add Menu Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => Linking.openURL(`tel:${cafeData.contact}`)}
        >
          <Text style={styles.secondaryButtonText}>Call to Reserve</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f1e9" },
  contentContainer: { paddingBottom: 20 },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  cafeName: { fontSize: 28, fontWeight: "bold", color: "#3c2f2f" },
  carouselContainer: { marginVertical: 20 },
  carousel: { height: 200 },
  carouselImage: { width: width * 0.8, height: 200, borderRadius: 10, marginHorizontal: 10 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
  },
  uploadButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  infoContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#3c2f2f", marginBottom: 10 },
  description: { fontSize: 16, color: "#4a3728", lineHeight: 24, marginBottom: 20 },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { fontSize: 16, color: "#4a3728", marginLeft: 10 },
  link: { color: "#007AFF", textDecorationLine: "underline" },
  buttonContainer: { paddingHorizontal: 20, marginTop: 20 },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryButtonText: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
});