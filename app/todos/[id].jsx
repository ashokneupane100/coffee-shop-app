import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : [];

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((t) => t.id.toString() === id.toString());
          if (myTodo) {
            setTodo(myTodo);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const saveTodo = { ...todo, title: todo.title };
      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : [];

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (t) => t.id.toString() !== saveTodo.id.toString()
        );
        
        const updatedTodos = [...otherTodos, saveTodo];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(updatedTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([saveTodo]));
      }
      
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  // Apply theme to styles
  const containerStyle = {
    ...styles.container,
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
  };

  const inputStyle = {
    ...styles.input,
    borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
    color: colorScheme === 'dark' ? '#fff' : '#000',
    backgroundColor: colorScheme === 'dark' ? '#262626' : '#fff',
  };

  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.inputContainer}>
        <TextInput
          style={inputStyle}
          placeholder="Edit todo"
          maxLength={30}
          placeholderTextColor={colorScheme === 'dark' ? '#aaa' : 'gray'}
          value={todo?.title || ''}
          onChangeText={(text) => setTodo(prev => ({...prev, title: text}))}
        />
        
        <Pressable
          style={styles.themeToggle}
          onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
        >
          <Octicons 
            name={colorScheme === "dark" ? "moon" : "sun"} 
            size={36} 
            color={iconColor} 
          />
        </Pressable>
        
        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      
      <Pressable
        onPress={() => router.push("/")}
        style={[styles.saveButton, {backgroundColor: 'red'}]}
      >
        <Text style={styles.saveButtonText}>Cancel</Text>
      </Pressable>
      
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
   borderColor:"green",
   
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter_500Medium"
  },
  themeToggle: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    pointerEvents:'auto'
  },
 
});