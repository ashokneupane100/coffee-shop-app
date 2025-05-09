import { Text, View, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Octicons, Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { data } from "@/data/todos";

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const isDark = colorScheme === 'dark';
  const router = useRouter();

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
        console.error("Error loading todos:", e);
        setTodos(data);
      }
    };

    fetchData();
  }, []); 

  // Save todos to storage when they change
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error("Error saving todos:", e);
      }
    };

    if (todos.length > 0) {
      storeData();
    }
  }, [todos]);

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
      const newTodo = { id: newId, title: text, completed: false };
      
      setTodos([newTodo, ...todos]);
      setText('');
    }
  };

  // Navigate to todo details on regular press
  const navigateToDetails = (id) => {
    router.push(`/todos/${id}`);
  };

  // Toggle completion status on long press
  const toggleTodo = (id) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            setTodos(todos.filter(todo => todo.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      <View style={{
        alignItems: 'center',
        paddingVertical: 20,
      }}>
        <View style={{
          backgroundColor: isDark ? '#6a5acd' : '#ff9800',
          borderRadius: 15,
          padding: 15,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}>
          <Text style={{
            fontSize: 26,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
          }}>
            Todo List by Ashok Neupane
          </Text>
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 15,
      }}>
        <TextInput
          style={{
            flex: 1,
            borderColor: isDark ? '#555' : '#ddd',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginRight: 10,
            fontSize: 16,
            color: theme.text,
            backgroundColor: isDark ? '#333' : '#fff',
          }}
          placeholder="Add a new todo"
          placeholderTextColor={isDark ? "#aaa" : "#777"}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <TouchableOpacity 
          onPress={addTodo} 
          style={{
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: isDark ? '#000' : '#fff',
          }}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowThemeSelector(!showThemeSelector)} 
          style={{
            marginLeft: 10,
            padding: 8,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          }}
        >
          <Octicons 
            name={isDark ? "moon" : "sun"} 
            size={28} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>

      {showThemeSelector && (
        <View style={{
          marginHorizontal: 15,
          marginBottom: 15,
          borderRadius: 10,
          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          padding: 12,
        }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderRadius: 8,
              marginVertical: 4,
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: '#ff9800',
            }} 
            onPress={() => {
              setColorScheme('light');
              setShowThemeSelector(false);
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: theme.text,
            }}>Light Theme</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderRadius: 8,
              marginVertical: 4,
              backgroundColor: 'rgba(111, 66, 193, 0.2)',
              borderWidth: colorScheme === 'dark' ? 1 : 0,
              borderColor: '#6a5acd',
            }} 
            onPress={() => {
              setColorScheme('dark');
              setShowThemeSelector(false);
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: theme.text,
            }}>Dark Theme</Text>
          </TouchableOpacity>
        </View>
      )}

      {todos.length === 0 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Feather name="clipboard" size={50} color={isDark ? '#555' : '#ccc'} />
          <Text style={{
            marginTop: 10,
            fontSize: 16,
            color: isDark ? '#888' : '#aaa',
            textAlign: 'center',
          }}>No tasks yet. Add a new task above!</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TouchableOpacity
              // Short press navigates to details
              onPress={() => navigateToDetails(item.id)}
              // Long press toggles completion
              onLongPress={() => toggleTodo(item.id)}
              delayLongPress={500}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 6,
                marginHorizontal: 15,
                padding: 15,
                borderRadius: 8,
                backgroundColor: isDark ? '#222' : '#fff',
                borderLeftWidth: 5,
                borderLeftColor: isDark ? '#6a5acd' : '#ff9800',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 2.22,
                elevation: 3,
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: isDark ? '#6a5acd' : '#ff9800',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.completed ? (isDark ? '#6a5acd' : '#ff9800') : 'transparent',
                    marginRight: 12,
                  }}>
                    {item.completed && (
                      <Feather name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={{
                    fontSize: 16,
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                    color: item.completed ? (isDark ? '#888' : '#aaa') : theme.text,
                  }}>
                    {item.title}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => confirmDelete(item.id)} 
                  style={{
                    backgroundColor: isDark ? '#442639' : '#ffebee',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: isDark ? '#ff6b6b' : '#ff5252',
                  }}
                >
                  <Text style={{
                    color: '#ff5252',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      )}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}