import { Box, Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

export const DesktopNav = () => {
  return (
    <Box display={{ base: "none", md: "block" }}>
      <Box position={"relative"} ml={"auto"} mr={"150px"}>
        <ChakraLink
          _hover={{ textDecoration: "none", color: "gray.500" }}
          as={ReactRouterLink}
          fontSize={"18px"}
          pr={"10px"}
          pl={"15px"}
          fontWeight={"bold"}
          borderRight={"1px solid "}
          to="/main"
        >
          ホーム
        </ChakraLink>
        <ChakraLink
          _hover={{ textDecoration: "none", color: "gray.500" }}
          as={ReactRouterLink}
          fontSize={"18px"}
          pr={"10px"}
          pl={"10px"}
          fontWeight={"bold"}
          borderRight={"1px solid "}
          to="/assignment"
        >
          課題の共有
        </ChakraLink>
        <ChakraLink
          _hover={{ textDecoration: "none", color: "gray.500" }}
          as={ReactRouterLink}
          fontSize={"18px"}
          pr={"10px"}
          pl={"10px"}
          fontWeight={"bold"}
          borderRight={"1px solid "}
          to="/goal"
        >
          目標の共有
        </ChakraLink>
        <ChakraLink
          _hover={{ textDecoration: "none", color: "gray.500" }}
          as={ReactRouterLink}
          fontSize={"18px"}
          pr={"10px"}
          pl={"10px"}
          fontWeight={"bold"}
          borderRight={"1px solid "}
          to="/schedule"
        >
          予定の共有
        </ChakraLink>
        <ChakraLink
          _hover={{ textDecoration: "none", color: "gray.500" }}
          as={ReactRouterLink}
          fontSize={"18px"}
          pr={"10px"}
          pl={"10px"}
          fontWeight={"bold"}
          borderRight={"1px solid "}
          to="/attendance"
        >
          出欠の共有
        </ChakraLink>

      </Box>
    </Box>
  );
};
