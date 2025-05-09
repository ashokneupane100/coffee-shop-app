import {useLocalSearchParams} from "expo-router";
import {View,Text,StyleSheet,Pressable,TextInput} from 'react-native';
import {useState,useEffect,useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeContext} from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from 'expo-router';
import {Inter_500Medium,useFonts} from "@expo-google-fonts/inter";



export default function EditScreen(){
    const {id}=useLocalSearchParams();
    const[todo,setTodo]=useState({})
    const{colorSheme,setColorScheme,theme} =useContext(ThemeContext);
    const router=useRouter();
    const[loaded,error]=useFonts({
        Inter_500Medium,
    })

    useEffect(()=>{
       const fetchData=async(id)=>{
        try{
            const jsonValue=await AsyncStorage.getItem("TodoApp")
            const storageTodos=jsonValue !==null ?JSON.parse(jsonValue):null;

            if(storageTodos){
                const myTodo=storageTodos.find((todo)=>todo.id.toString())
                setTodo(todo)===id
                setTodo(myTodo)
            }

        }catch(err){
            console.log(err)

        }
       }
       fetchData(id)
    },[])

    

    if(!loaded && !error){
        return null;
    }



    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, marginBottom: 10, textAlign: "center" }}>
          Edit {id} here we go
        </Text>
     

      </View>


    )

}