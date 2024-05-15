import { useForm } from "react-hook-form";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";

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
import { useNavigate } from "react-router-dom";

export const CreateTeam = () => {
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
    console.log(data.teamName);

    try {
      const groupId = uuidv4();
      const { teamName } = data;

      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.displayName;

      const user = {
        userId: userId,
        userName: userName,
      };

      await addDoc(collection(db, "Groups"), {
        groupId: groupId,
        groupName: teamName,
        members: [user], 
        tasks: [],
        goals: [],
        events: [],
        attendance: [],
        absence: [],
      });

      console.log("チームが作成されました");
      navigation("/main");
    } catch (error) {
      console.error("チームの作成中にエラーが発生しました", error);
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
                新しくチームを作成します
              </Text>
            </VStack>
            <HStack mt={"70px"}>
              <FormLabel ml={{ md: "10px" }}>グループ名</FormLabel>
              <Input
                type="text"
                w={{ base: "160px", md: "250px" }}
                shadow={"outline"}
                {...register("teamName", {
                  required: "チーム名を入力してください。",
                  maxLength: {
                    value: 12,
                    message: "12文字以内で入力してください。",
                  },
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
              作成
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
};
