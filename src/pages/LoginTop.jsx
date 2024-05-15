import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Home } from "./Home";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

import { db } from "../firebase";

import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Main } from "./Main";

export const LoginTop = () => {
  const [user] = useAuthState(auth);
  const [groupExists, setGroupExists] = useState(false);

  useEffect(() => {
    const checkGroupExistence = async () => {
      try {
        if (user) {
          const userId = auth.currentUser.uid;
          const userName = auth.currentUser.displayName;
          const user = {
            userId: userId,
            userName: userName,
          };
          const q = query(
            collection(db, "Groups"),
            where("members", "array-contains", user)
          );
          const querySnapshot = await getDocs(q);
          setGroupExists(!querySnapshot.empty);
          console.log("Firestoreにユーザーの存在を確認しました");
        }
      } catch (error) {
        console.error(
          "Firestoreの情報を取得する際にエラーが発生しました",
          error
        );
      }
    };

    checkGroupExistence();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);

      if (auth.currentUser) {
        const userId = auth.currentUser.uid;

        const q = query(collection(db, "Users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return;
        }

        await addDoc(collection(db, "Users"), {
          userName: auth.currentUser.displayName,
          userId: userId,
        });
      }
    } catch (e) {
      console.error("ログインによるエラーが発生しました。", e);
    }
  };

  return (
    <Box w={"100%"} h={"100vh"} bgColor={"blue.200"}>
      {user ? (
        <>
          {groupExists ? (
            <Main />
          ) : (
            <Home displayName={auth.currentUser.displayName} />
          )}
        </>
      ) : (
        <VStack pt={{base: "110px", md: "80px"}}>
          <Text fontSize={{base: "40px", md: "60px"}} fontWeight={"bold"}>
            Teamシェア
          </Text>
          <Text fontSize={"18px"} mt={{base: "50px", md: "10px"}}>
            チームの課題・目標・予定を設定し
          </Text>
          <Text fontSize={"18px"}>共有することでチーム力を高めよう</Text>
          <Button
            onClick={signInWithGoogle}
            h={"60px"}
            mt={"80px"}
            borderRadius={"20px"}
            bgColor={"white"}
            _hover={{ bg: "gray.300" }}
            shadow={"lg"}
          >
            Googleでサインイン
          </Button>
        </VStack>
      )}
    </Box>
  );
};
