import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons, Octicons, Feather } from '@expo/vector-icons';
import Animated, { 
  LinearTransition, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { data } from "@/data/todos";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  // Animation values
  const titleScale = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const bgGradientValue = useSharedValue(0);
  const addButtonScale = useSharedValue(1);

  // Title animation
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 1000 });
    
    // Subtle continuous pulse animation
    titleScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1, // Infinite repeats
      true // Reverse on each sequence
    );
    
    // Gradient background animation
    bgGradientValue.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  // Load todos from storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id));
        } else {
          setTodos(data.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [data]);

  // Save todos to storage when they change
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };

    storeData();
  }, [todos]);

  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if (text.trim()) {
      // Add button animation
      addButtonScale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handlePress = (id) => {
    router.push(`/todos/${id}`);
  };

  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: titleScale.value }
      ],
      opacity: titleOpacity.value,
    };
  });

  const titleBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = colorScheme === 'dark' 
      ? `rgba(80, 40, 100, ${0.7 + bgGradientValue.value * 0.3})` 
      : `rgba(255, 165, 0, ${0.7 + bgGradientValue.value * 0.3})`;
      
    return {
      backgroundColor,
      transform: [
        { scale: 1 + bgGradientValue.value * 0.03 }
      ]
    };
  });

  const addButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: addButtonScale.value }]
    };
  });

  const renderItem = ({ item }) => (
    <Animated.View 
      style={styles.todoItem}
      entering={LinearTransition.springify()}
      exiting={LinearTransition.springify()}
      layout={LinearTransition.springify()}
    >
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
        style={{ flex: 1 }}
      >
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeTodo(item.id)} style={styles.deleteButton}>
        <MaterialCommunityIcons 
          name="delete-circle" 
          size={36} 
          color={colorScheme === 'dark' ? "#ff6b6b" : "#ff5252"} 
        />
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[styles.titleBackground, titleBackgroundStyle]}>
          <AnimatedText style={[styles.title, titleAnimatedStyle]}>
            Todo List by Ashok Neupane
          </AnimatedText>
        </Animated.View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Add a new todo"
          placeholderTextColor={colorScheme === 'dark' ? "#aaa" : "#777"}
          value={text}
          onChangeText={setText}
        />
        <AnimatedPressable 
          onPress={addTodo} 
          style={[styles.addButton, addButtonAnimatedStyle]}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </AnimatedPressable>
        <Pressable
          onPress={toggleThemeSelector} 
          style={styles.themeToggle}
        >
          <Octicons 
            name={colorScheme === 'dark' ? "moon" : "sun"} 
            size={28} 
            color={theme.text} 
          />
        </Pressable>
      </View>

      {showThemeSelector && (
        <View style={styles.themeSelectorContainer}>
          <Pressable 
            style={[
              styles.themeOption, 
              colorScheme === 'light' && styles.selectedThemeOption,
              { backgroundColor: 'rgba(255, 165, 0, 0.2)' }
            ]} 
            onPress={() => {
              setColorScheme('light');
              setShowThemeSelector(false);
            }}
          >
            <Ionicons name="sunny" size={24} color="#ff9800" />
            <Text style={styles.themeOptionText}>Light Theme</Text>
            {colorScheme === 'light' && (
              <Feather name="check" size={18} color="#ff9800" style={styles.checkIcon} />
            )}
          </Pressable>
          
          <Pressable 
            style={[
              styles.themeOption, 
              colorScheme === 'dark' && styles.selectedThemeOption,
              { backgroundColor: 'rgba(111, 66, 193, 0.2)' }
            ]} 
            onPress={() => {
              setColorScheme('dark');
              setShowThemeSelector(false);
            }}
          >
            <Ionicons name="moon" size={24} color="#6a5acd" />
            <Text style={styles.themeOptionText}>Dark Theme</Text>
            {colorScheme === 'dark' && (
              <Feather name="check" size={18} color="#6a5acd" style={styles.checkIcon} />
            )}
          </Pressable>
        </View>
      )}

      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id.toString()}
        contentContainerStyle={styles.listContainer}
        itemLayoutAnimation={LinearTransition.springify()}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    titleBackground: {
      borderRadius: 15,
      padding: 15,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#ffffff',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      paddingHorizontal: 15,
      paddingVertical: 5,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
    },
    input: {
      flex: 1,
      borderColor: isDark ? '#555' : '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginRight: 10,
      fontSize: 16,
      color: theme.text,
      backgroundColor: isDark ? '#333' : '#fff',
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#000' : '#fff',
    },
    themeToggle: {
      marginLeft: 10,
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    themeSelectorContainer: {
      marginHorizontal: 15,
      marginBottom: 15,
      borderRadius: 10,
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginVertical: 4,
    },
    selectedThemeOption: {
      borderWidth: 1,
      borderColor: isDark ? '#6a5acd' : '#ff9800',
    },
    themeOptionText: {
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    checkIcon: {
      marginLeft: 'auto',
    },
    listContainer: {
      flexGrow: 1,
      paddingHorizontal: 15,
      paddingBottom: 20,
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      marginVertical: 6,
      borderRadius: 8,
      backgroundColor: isDark ? '#222' : '#fff',
      borderLeftWidth: 5,
      borderLeftColor: isDark ? '#6a5acd' : '#ff9800',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2.22,
      elevation: 3,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
    },
    todoText: {
      fontSize: 16,
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: isDark ? '#888' : '#aaa',
    },
    deleteButton: {
      padding: 5,
    }
  });
}