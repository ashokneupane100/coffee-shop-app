import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { data } from "@/data/todos";
import{Inter_500Medium,useFonts} from "@expo-google-fonts/inter"

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState("");

const[loaded,error]=useFonts({
  Inter_500Medium,
})

if(!loaded && !error){
  return null

}

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]); // Fixed to add to existing todos
      setText("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Todo List</Text>
        
        {/* Input area */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TextInput
            style={{ flex: 1,fontFamily:"Inter_500Medium", borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
            value={text}
            onChangeText={setText}
            placeholder="Add a new todo"
          />
          <Pressable 
            style={{ backgroundColor: '#007AFF', padding: 10, marginLeft: 10, borderRadius: 5, justifyContent: 'center' }}
            onPress={addTodo}
          >
            <Text style={{ color: 'white',padding:"10" }}>Add</Text>
          </Pressable>
        </View>
        
        {/* Todo list */}
        {todos.map(todo => (
          <View  key={todo.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Pressable 
              style={{ width: 24, height: 24, borderWidth: 1, borderRadius: 12, marginRight: 10, backgroundColor: todo.completed ? '#007AFF' : 'white' }}
              onPress={() => toggleTodo(todo.id)}
            />
            <Text style={{ flex: 1, textDecorationLine: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </Text>
            <Pressable onPress={() => removeTodo(todo.id)}>
              <Text style={{ color: 'white',backgroundColor:"red",padding:"8", borderRadius:10 }}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}