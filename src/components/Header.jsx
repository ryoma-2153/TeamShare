import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [teamName, setTeamName] = useState(null); // チーム名の状態
  const [teamMembers, setTeamMembers] = useState([]); // チームメンバーの状態

  const navigation = useNavigate();

  // チーム名を取得する関数
  const fetchTeamName = async () => {
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

      querySnapshot.forEach((doc) => {
        const groupName = doc.data().groupName;

        setTeamName(groupName); // チーム名の状態を更新
      });

      // チームメンバーを取得する関数を呼び出す
      fetchTeamMembers();
    } catch (error) {
      console.error("グループ名の取得中にエラーが発生しました", error);
    }
  };

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

      setTeamMembers(members); // チームメンバーの状態を更新
    } catch (error) {
      console.error("チームメンバーの取得中にエラーが発生しました", error);
    }
  };

  useEffect(() => {
    fetchTeamName(); // チーム名を取得する
  }, []);

  const handleTeamOut = async () => {
    try {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.displayName;

      const q = query(
        collection(db, "Groups"),
        where("members", "array-contains", { userId, userName })
      );
      const querySnapshot = await getDocs(q);

      const promises = [];

      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        const updatedMembers = groupData.members.filter(
          (member) => member.userId !== userId
        );

        promises.push(updateDoc(doc.ref, { members: updatedMembers }));

        // attendance フィールドからユーザーを削除
        const updatedAttendance = groupData.attendance.filter(
          (entry) => entry.userName !== userName
        );
        promises.push(updateDoc(doc.ref, { attendance: updatedAttendance }));

        // absence フィールドからユーザーを削除
        const updatedAbsence = groupData.absence.filter(
          (entry) => entry.userName !== userName
        );
        promises.push(updateDoc(doc.ref, { absence: updatedAbsence }));
      });

      // すべての更新処理が完了するまで待機
      await Promise.all(promises);

      console.log(`${userName} さんがチームから退会しました。`);

      auth.signOut();
      navigation("/");
    } catch (error) {
      console.error("チームからの退会中にエラーが発生しました", error);
    }
  };

  const signOut = () => {
    auth.signOut();
    navigation("/");
  };

  return (
    <HStack w={"100%"} h={"80px"} bgColor={"blue.100"}>
      <MobileNav />
      <DesktopNav />
      <Box>
        <Text
          ml={"30px"}
          fontSize={{ base: "25px", md: "30px" }}
          fontWeight={"bold"}
        >
          {teamName}
        </Text>
      </Box>
      <Spacer />
      <Box mr={"20px"}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<ChevronDownIcon />}
            w={{ base: "40px", md: "60px" }}
            h={{ base: "40px", md: "60px" }}
            borderRadius={"90px"}
          />
          <MenuList
            w={"60px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <MenuItem>＜メンバーリスト＞</MenuItem>
            {teamMembers.map((member) => (
              <MenuItem key={member.userId}>{member.userName}</MenuItem>
            ))}
            <HStack mt={"15px"}>
              <Button
                onClick={() => handleTeamOut()}
                w={"80px"}
                h={"35px"}
                mb={"5px"}
                fontSize={"14px"}
                fontWeight={"bold"}
                color={"white"}
                bgColor={"red.500"}
                _hover={{ bgColor: "red.200" }}
                shadow={"md"}
              >
                退会
              </Button>

              <Button
                w={"80px"}
                h={"35px"}
                mb={"5px"}
                fontSize={"14px"}
                fontWeight={"bold"}
                color={"white"}
                bgColor={"red.500"}
                _hover={{ bgColor: "red.200" }}
                shadow={"md"}
                onClick={() => signOut()}
              >
                ログアウト
              </Button>
            </HStack>
          </MenuList>
        </Menu>
      </Box>
    </HStack>
  );
};
