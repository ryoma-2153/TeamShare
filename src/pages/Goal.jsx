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
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

export const Goal = () => {
  const [goalName, setGoalName] = useState("");
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Groups"));
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        if (groupData.goals) {
          goalsData.push(...groupData.goals);
        }
      });
      setGoals(goalsData);
      console.log("目標の取得に成功しました");
    } catch (error) {
      console.error("目標の取得中にエラーが発生しました", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addDeleteGoal = async (DeleteGoal) => {
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
        const goalData = { goalName: DeleteGoal };
        const docRef = doc.ref;
        await updateDoc(docRef, {
          goals: arrayRemove(goalData),
        });
        console.log("目標の削除に成功しました。");
        fetchGoals();
      });
    } catch (error) {
      console.error("目標の削除中にエラーが発生しました", error);
    }
  };

  const createGoal = async () => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userName = auth.currentUser.displayName;
    const user = {
      userId: userId,
      userName: userName,
    };

    try {
      // ユーザーが所属するグループを検索するクエリ
      const q = query(
        collection(db, "Groups"),
        where("members", "array-contains", user)
      );
      const querySnapshot = await getDocs(q);
      const groupId = querySnapshot.docs[0].id;

      const goalData = { goalName: goalName };
      const docRef = doc(db, "Groups", groupId);
      await updateDoc(docRef, { goals: arrayUnion(goalData) });

      setGoalName("");
      fetchGoals();
      console.log("目標が作成されました");
    } catch (error) {
      console.error("目標の作成中にエラーが発生しました", error);
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
            目標の作成
          </FormLabel>
          <Input
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            w={{ base: "50", md: "80vh" }}
            mt={"20px"}
            type="text"
          />
          <Button
            onClick={createGoal}
            bgColor={"blue.400"}
            _hover={{ bgColor: "blue.200" }}
            mt={{ base: "10px", md: "35px" }}
            color={"white"}
            fontWeight={"normal"}
          >
            作成
          </Button>
        </VStack>
        {goals.map((goal, index) => (
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
              {goal.goalName}
            </Text>
            <IconButton
              mr={"10px"}
              colorScheme="red"
              aria-label="delete todo"
              icon={<DeleteIcon />}
              onClick={() => addDeleteGoal(goal.goalName)}
            />
          </HStack>
        ))}
      </VStack>

      <Footer />
    </>
  );
};
