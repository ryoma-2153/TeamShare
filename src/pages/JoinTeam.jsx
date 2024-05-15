import { useForm } from "react-hook-form";

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const JoinTeam = () => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUserName = async () => {
      if (!auth.currentUser) return;
      const userId = auth.currentUser.uid;
      try {
        const q = query(collection(db, "Users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUserName(doc.data().userName);
        });
      } catch (error) {
        console.error("ユーザーデータの取得中にエラーが発生しました", error);
      }
    };
    fetchUserName();
  }, []);

  const onSubmit = async (data) => {
    try {
      const groupId = data.teamNumber; 

      const groupQuery = query(
        collection(db, "Groups"),
        where("groupId", "==", groupId)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        console.log("該当のチームが見つかりませんでした");
        return;
      }

      const userName = auth.currentUser.displayName;
      const userId = auth.currentUser.uid;
      const user = {
        userId: userId,
        userName: userName,
      };

      const groupDoc = groupSnapshot.docs[0];
      const groupRef = doc(db, "Groups", groupDoc.id);
      await updateDoc(groupRef, {
        members: arrayUnion(user),
      });

      console.log("チームへの参加が完了しました");
      navigation("/main");
    } catch (error) {
      console.error("チームへの参加時にエラーが発生しました", error);
    }
  };

  return (
    <Center h={"100vh"} bgColor={"blue.200"}>
      <VStack
        w={{ base: "300px", md: "400px" }}
        h={{ base: "400px", md: "450px" }}
        justifyContent={"center"}
        bgColor={"white"}
        borderRadius={"30px"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <VStack>
              <Text fontSize={{ base: "18px", md: "20px" }} fontWeight={"bold"}>
                {userName}さんようこそ
                <br />
                既存のチームに参加します
              </Text>
            </VStack>
            <HStack mt={"70px"}>
              <FormLabel ml={{ md: "10px" }}>チームID</FormLabel>
              <Input
                type="text"
                w={{ base: "160px", md: "250px" }}
                shadow={"outline"}
                {...register("teamNumber", {
                  required: "チームIDを入力してください。",
                })}
              />
            </HStack>
            <Text mt={"10px"} ml={"110px"} color={"red"} fontSize={"13px"}>
              {errors.teamName?.message}
            </Text>
            <Button
              type="submit"
              mt={"70px"}
              ml={{ base: "100px", md: "160px" }}
            >
              参加
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
};
