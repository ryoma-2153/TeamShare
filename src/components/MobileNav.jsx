import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";

import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const MobileNav = () => {
  const [teamId, setTeamId] = useState(null);

  const fetchTeamId = async () => {
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
      querySnapshot.forEach((doc) => {
        const groupId = doc.data().groupId;

        setTeamId(groupId);
      });
    } catch (error) {
      console.error("グループIDの取得中にエラーが発生しました", error);
    }
  };

  useEffect(() => {
    fetchTeamId();
  }, []);

  return (
    <>
      <Menu>
        <MenuButton
          display={{ md: "none" }}
          as={IconButton}
          icon={<HamburgerIcon />}
          w={{ base: "40px", md: "70px" }}
          h={{ base: "40px", md: "70px" }}
          borderRadius={"90px"}
          ml={{ base: "10px", md: "20px" }}
          bgColor={"white"}
        />
        <MenuList w={{ base: "100px", md: "" }}>
          <MenuItem _hover={{ bg: "none" }}>
            <Text>
              チームID:
              <br />
              {teamId}
            </Text>
          </MenuItem>
          <MenuItem>
            <Link to="/main">ホーム</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/assignment">課題の共有</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/goal">目標の共有</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/schedule">予定の共有</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/attendance">出欠の共有</Link>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
