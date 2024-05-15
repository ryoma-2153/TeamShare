import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const Attendance = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState({});
  const [message, setMessage] = useState("");

  const fetchTeamMembers = async () => {
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

      const members = [];
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        groupData.members.forEach((member) => {
          if (member !== userName && !members.includes(member)) {
            members.push(member);
          }
        });
      });
      setTeamMembers(members);
      console.log("チームメンバーの取得に成功しました");
    } catch (error) {
      console.error("チームメンバーの取得中にエラーが発生しました", error);
    }
  };

  const clickMessage = () => {
    try {
      setMessage("＊出欠登録が完了しました。");

      setTimeout(() => {
        setMessage("");
      }, 30000);
    } catch (error) {
      console.error("出席情報の保存中にエラーが発生しました", error);
    }
  };

  const calculateAttendanceRate = async () => {
    const rates = {};
    try {
      await Promise.all(
        teamMembers.map(async (member) => {
          const groupRef = collection(db, "Groups");
          const q = query(
            groupRef,
            where("members", "array-contains", {
              userId: member.userId,
              userName: member.userName,
            })
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const attendanceArray = docData.attendance || [];
            const absenceArray = docData.absence || [];
            const attendanceCount =
              attendanceArray.find((item) => item.userName === member.userName)
                ?.attendCount || 0;
            const absenceCount =
              absenceArray.find((item) => item.userName === member.userName)
                ?.absenceCount || 0;
            const total = attendanceCount + absenceCount;
            const rate = total === 0 ? 0 : (attendanceCount / total) * 100;
            rates[member.userName] = rate.toFixed(1) + "%";
          });
        })
      );
      setAttendanceRate(rates);
      console.log("出席率が計算されました");
    } catch (error) {
      console.error("出席率の計算中にエラーが発生しました", error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleClickAttend = async (userName) => {
    try {
      const groupRef = collection(db, "Groups");
      const q = query(
        groupRef,
        where("members", "array-contains", {
          userId: auth.currentUser.uid,
          userName: userName,
        })
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        const currentData = doc.data();
        const attendanceArray = currentData.attendance || [];

        const existingIndex = attendanceArray.findIndex(
          (item) => item.userName === userName
        );
        if (existingIndex !== -1) {
          attendanceArray[existingIndex].attendCount++;
        } else {
          attendanceArray.push({ userName: userName, attendCount: 1 });
        }
        await updateDoc(docRef, { attendance: attendanceArray });
      });
      console.log("出席情報の保存に成功しました");
      calculateAttendanceRate();
      clickMessage();
    } catch (error) {
      console.error("出席情報の保存中にエラーが発生しました", error);
    }
  };

  const handleClickNonAttend = async (userName) => {
    try {
      const groupRef = collection(db, "Groups");
      const q = query(
        groupRef,
        where("members", "array-contains", {
          userId: auth.currentUser.uid,
          userName: userName,
        })
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        const currentData = doc.data();
        const absenceArray = currentData.absence || [];

        const existingIndex = absenceArray.findIndex(
          (item) => item.userName === userName
        );
        if (existingIndex !== -1) {
          absenceArray[existingIndex].absenceCount++;
        } else {
          absenceArray.push({ userName: userName, absenceCount: 1 });
        }
        await updateDoc(docRef, { absence: absenceArray });
      });
      console.log("欠席情報の保存に成功しました");
      calculateAttendanceRate();
      clickMessage();
    } catch (error) {
      console.error("欠席情報の保存中にエラーが発生しました", error);
    }
  };

  return (
    <>
      <Header />

      <VStack w={"100%"} h={"100%"} bgColor={"blue.200"}>
        <VStack
          w={{ base: "90%", md: "80%" }}
          h={"100%"}
          mt={"20px"}
          mb={"30px"}
          pb={"30px"}
          borderRadius={"20px"}
          bgColor={"white"}
        >
          <Text mt={"10px"} fontSize={"25px"} fontWeight={"bold"}>
            出席登録
          </Text>
          <HStack flexWrap={"wrap"}>
            {teamMembers.map((member) => {
              return (
                <VStack
                  key={member.userId}
                  w={{ base: "140px", md: "300px" }}
                  h={{ base: "100px", md: "150px" }}
                  ml={{ base: "10px", md: "40px" }}
                  mt={"10px"}
                  shadow={"lg"}
                  borderRadius={"20px"}
                  bgColor={"white"}
                >
                  <Text
                    fontSize={{ base: "16px", md: "23px" }}
                    mt={{ base: "10px", md: "15px" }}
                  >
                    {member.userName}
                  </Text>
                  <HStack>
                    <Button
                      onClick={() => handleClickAttend(member.userName)}
                      disabled={member.attended}
                      w={{ base: "45px", md: "80px" }}
                      h={{ base: "35px", md: "50px" }}
                      fontSize={{ base: "15px", md: "18px" }}
                      color={"white"}
                      bgColor={"green.500"}
                      shadow={"md"}
                      mr={{ base: "5px", md: "10px" }}
                      ml={{ base: "5px", md: "15px" }}
                      mt={{ base: "5px", md: "5px" }}
                      _hover={{ bgColor: "green.300" }}
                    >
                      出席
                    </Button>
                    <Button
                      onClick={() => handleClickNonAttend(member.userName)}
                      disabled={member.attended}
                      w={{ base: "45px", md: "80px" }}
                      h={{ base: "35px", md: "50px" }}
                      fontSize={{ base: "15px", md: "18px" }}
                      color={"white"}
                      bgColor={"red.500"}
                      shadow={"md"}
                      mr={{ base: "5px", md: "15px" }}
                      ml={{ base: "5px", md: "10px" }}
                      mt={{ base: "5px", md: "5px" }}
                      _hover={{ bgColor: "red.300" }}
                    >
                      欠席
                    </Button>
                  </HStack>
                  <Text fontSize={"14px"} color={"green.500"}>
                    {message}
                  </Text>
                </VStack>
              );
            })}
          </HStack>
        </VStack>

        <VStack
          w={{ base: "90%", md: "80%" }}
          h={"100%"}
          mb={"30px"}
          pb={"30px"}
          borderRadius={"20px"}
          bgColor={"white"}
        >
          <Text mt={"10px"} fontSize={"25px"} fontWeight={"bold"}>
            出席率一覧
          </Text>
          <Button onClick={() => calculateAttendanceRate()}>
            出席率を表示する
          </Button>
          <HStack flexWrap={"wrap"}>
            {teamMembers.map((member) => {
              return (
                <HStack
                  key={member.userId}
                  w={{ base: "140px", md: "300px" }}
                  h={{ base: "80px", md: "100px" }}
                  ml={{ base: "8px", md: "40px" }}
                  mt={"10px"}
                  shadow={"lg"}
                  borderRadius={"20px"}
                  bgColor={"white"}
                >
                  <Text
                    fontSize={{ base: "16px", md: "23px" }}
                    ml={{ base: "8px", md: "25px" }}
                  >
                    {member.userName}
                  </Text>
                  <Text
                    fontSize={{ base: "18px", md: "25px" }}
                    ml={{ base: "15px", md: "30px" }}
                  >
                    {attendanceRate[member.userName] || "0%"}
                  </Text>
                </HStack>
              );
            })}
          </HStack>
        </VStack>
      </VStack>

      <Footer />
    </>
  );
};
