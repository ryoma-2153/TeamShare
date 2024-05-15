import { Button, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

export const Home = () => {
  return (
    <VStack>
      <Text mt={"80px"} fontSize={{base: "25px", md: "30px"}}>
        {auth.currentUser.displayName}さん
      </Text>
      <Text fontSize={{base: "25px", md: "40px"}}>Teamシェアへようこそ！！</Text>
      <Button
        as={Link}
        to={"/create"}
        h={"60px"}
        mt={"80px"}
        border={"2px solid black"}
        bgColor={"white"}
        _hover={{ bg: "gray.300" }}
        shadow={"lg"}
      >
        チームを作成する
      </Button>
      <Text>新しくチームを作成します</Text>

      <Button
        as={Link}
        to={"/join"}
        h={"60px"}
        mt={"20px"}
        border={"2px solid black"}
        bgColor={"white"}
        _hover={{ bg: "gray.300" }}
        shadow={"lg"}
      >
        チームに参加する
      </Button>
      <Text>既存のチームに参加します</Text>
    </VStack>
  );
};
