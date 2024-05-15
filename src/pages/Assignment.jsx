import {
  Button,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { DeleteIcon } from "@chakra-ui/icons";

export const Assignment = () => {
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Groups"));
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        if (groupData.tasks) {
          tasksData.push(...groupData.tasks);
        }
      });
      setTasks(tasksData);
      console.log("課題の取得に成功しました");
    } catch (error) {
      console.error("課題の取得中にエラーが発生しました", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addDeleteTask = async (DeleteTask) => {
    if (!auth.currentUser) return;

    const userName = auth.currentUser.displayName;
    const userId = auth.currentUser.uid;
    const user = {
      userId: userId,
      userName: userName,
    };

    try {
      const q = query(
        collection(db, "Groups"),
        where("members", "array-contains", user)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const taskData = { taskName: DeleteTask };
        const docRef = doc.ref;
        await updateDoc(docRef, {
          tasks: arrayRemove(taskData),
        });
        console.log("課題の削除に成功しました。");
        fetchTasks();
      });
    } catch (error) {
      console.error("課題の削除中にエラーが発生しました", error);
    }
  };

  const createTask = async () => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userName = auth.currentUser.displayName;
    const user = {
      userId: userId,
      userName: userName,
    };

    try {
      const q = query(
        collection(db, "Groups"),
        where("members", "array-contains", user)
      );
      const querySnapshot = await getDocs(q);
      const groupId = querySnapshot.docs[0].id;

      const taskData = { taskName: taskName };
      const docRef = doc(db, "Groups", groupId);
      await updateDoc(docRef, { tasks: arrayUnion(taskData) });

      setTaskName("");
      fetchTasks();
      console.log("課題が作成されました");
    } catch (error) {
      console.error("課題の作成中にエラーが発生しました", error);
    }
  };

  return (
    <>
      <Header />

      <VStack
        w={"100%"}
        h={"100%"}
        pt={"70px"}
        pb={{base:"280px", md: "123px"}}
        bgColor={"blue.200"}
      >
        <VStack
          mt={{base:"0px", md: "20px"}}
          mb={"40px"}
          pb={"10px"}
          borderRadius={"10px"}
          shadow={"md"}
          bg={"white"}
          w={{ base: "85%", md: "100vh" }}
          h={{ base: "200px", md: "250px" }}
        >
          <FormLabel
            mt={{ base: "20px", md: "25px" }}
            fontSize={{ base: "23px", md: "28px" }}
            fontWeight={"bold"}
          >
            課題の作成
          </FormLabel>
          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            w={{ base: "88%", md: "80vh" }}
            mt={{base:"5px", md: "20px"}}
            type="text"
          />
          <Button
            onClick={createTask}
            bgColor={"blue.400"}
            _hover={{ bgColor: "blue.200" }}
            mt={{ base: "18px", md: "35px" }}
            color={"white"}
            fontWeight={"normal"}
          >
            作成
          </Button>
        </VStack>

        {tasks.map((task, index) => (
          <HStack
            key={index}
            mb={{base:"15px", md: "40px"}}
            borderRadius={"10px"}
            shadow={"md"}
            bg={"white"}
            w={{ base: "45vh", md: "100vh" }}
            h={{ base: "45px", md: "65px" }}
          >
            <Text
              fontWeight={"bold"}
              ml={"20px"}
              mr={"auto"}
              fontSize={{ base: "15px", md: "20px" }}
            >
              {task.taskName}
            </Text>
            <IconButton
              mr={"10px"}
              colorScheme="red"
              aria-label="delete todo"
              icon={<DeleteIcon />}
              onClick={() => addDeleteTask(task.taskName)}
            />
          </HStack>
        ))}
      </VStack>

      <Footer />
    </>
  );
};
