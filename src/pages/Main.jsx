import { Box, Text, VStack } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Main = () => {
  return (
    <Box h="100vh" overflowY="auto">
      <Header />

      <VStack w={"100%"} h={{base:"85vh", md: "82vh"}} bgColor={"blue.200"}>
        <Text fontSize={{base:"20px", md: "30px"}} mt={"50px"}>
          チームの
        </Text>
        <Text fontSize={"30px"} mt={"30px"} fontWeight={"bold"}>
          課題
        </Text>
        <Text fontSize={"30px"} mt={"10px"} fontWeight={"bold"}>
          目標
        </Text>
        <Text fontSize={"30px"} mt={"10px"} fontWeight={"bold"}>
          予定
        </Text>
        <Text fontSize={{ base: "20px", md: "30px" }} mt={"30px"}>
          　を確認・共有しよう！！
        </Text>
      </VStack>

      <Footer />
    </Box>
  );
};
