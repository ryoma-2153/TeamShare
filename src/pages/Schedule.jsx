import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import timeGridPlugin from "@fullcalendar/timegrid";
import { startOfMonth, endOfMonth, getUnixTime } from "date-fns";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { auth, db } from "../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const Schedule = () => {
  const [allEvents, setAllEvents] = useState([]); 
  const [monthlyEvents, setMonthlyEvents] = useState([]); 
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  const fetchEvents = async () => {
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

      const fetchedAllEvents = [];
      const fetchedMonthlyEvents = [];
      const now = new Date();
      const startOfMonthTimestamp = getUnixTime(startOfMonth(now));
      const endOfMonthTimestamp = getUnixTime(endOfMonth(now));

      querySnapshot.forEach((doc) => {
        const fetchedEvents = doc.data().events;
        fetchedAllEvents.push(...fetchedEvents);
        const filteredEvents = fetchedEvents.filter((event) => {
          const eventStartTimestamp = getUnixTime(new Date(event.start));
          return (
            eventStartTimestamp >= startOfMonthTimestamp &&
            eventStartTimestamp <= endOfMonthTimestamp
          );
        });
        fetchedMonthlyEvents.push(...filteredEvents);
      });

      setAllEvents(fetchedAllEvents);
      setMonthlyEvents(fetchedMonthlyEvents);

      console.log("イベントの取得に成功しました。");
    } catch (error) {
      console.error("イベントの取得中にエラーが発生しました", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const addUniqueIdToEvent = (event) => {
    return {
      ...event,
      id: uuidv4(), 
    };
  };

  const handleAddEvent = async () => {
    const eventWithUniqueId = addUniqueIdToEvent(newEvent);

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

      const groupId = querySnapshot.docs[0].id;

      const docRef = doc(db, "Groups", groupId);
      await updateDoc(docRef, { events: arrayUnion(eventWithUniqueId) });

      fetchEvents();
      console.log("イベントが作成されました");
    } catch (error) {
      console.error("イベントの作成中にエラーが発生しました", error);
    }
    setNewEvent({ title: "", start: "", end: "" });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventIdToDelete) => {
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
      const groupId = querySnapshot.docs[0].id;

      const docRef = doc(db, "Groups", groupId);
      await updateDoc(docRef, {
        events: monthlyEvents.filter((event) => event.id !== eventIdToDelete),
      });

      fetchEvents();
      console.log("イベントが削除されました");
    } catch (error) {
      console.error("イベントの削除中にエラーが発生しました", error);
    }
  };

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate().toString().padStart(2, "0");
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][
      dateTime.getDay()
    ];
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    return `${day}日(${dayOfWeek})${hours}:${minutes}`;
  };

  const now = new Date();
  const month = now.getMonth() + 1;

  return (
    <>
      <Header />
      <Box p={{base: "10px", md: "30px"}} bgColor={"blue.300"}>
        <Flex flexWrap={{ base: "wrap", md: "nowrap" }}>
          <Box
            w={{ base: "100%", md: "50%" }}
            h={{ base: "400px", md: "580px" }}
            ml={{ base: "", md: "15px" }}
            mt={{base: "20px", md: ""}}
            p="20px"
            bgColor={"white"}
            borderRadius={"20px"}
            shadow={"outline"}
          >
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              locales={[jaLocale]}
              locale="ja"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={allEvents.map((event) => ({
                ...event,
                id: event.start + event.end + event.title,
              }))}
            />
          </Box>
          <VStack
            w={{ base: "90%", md: "50%" }}
            h={{ base: "330px", md: "400px" }}
            mt={{ base: "30px", md: "150px" }}
            ml={{ base: "15px", md: "40px" }}
            p={{ base: "20px" }}
            bgColor={"white"}
            borderRadius={"20px"}
            shadow={"outline"}
          >
            <Text fontSize={"20px"} fontWeight={"bold"}>
              予定の追加
            </Text>
            <Input
              placeholder="予定を入力してください"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              mb="10px"
              h={{ base: "40px", md: "55px" }}
              mt="10px"
            />
            <Input
              type="datetime-local"
              placeholder="開始日時"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              mb="10px"
              h={{ base: "40px", md: "55px" }}
              mt="10px"
            />
            <Input
              type="datetime-local"
              placeholder="終了日時"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              mb="10px"
              h={{ base: "40px", md: "55px" }}
              mt="10px"
            />
            <Button
              onClick={handleAddEvent}
              colorScheme="blue"
              w={{ md: "180px" }}
              h={{ base: "40px", md: "50px" }}
              mt={{ base: "10px", md: "30px" }}
            >
              作成
            </Button>
          </VStack>
        </Flex>
        <VStack
          w={{base:"90%", md: "90%"}}
          bgColor={"white"}
          mt={"40px"}
          mb={"30px"}
          ml={{base:"15px", md: "30px"}}
          borderRadius={"20px"}
          pb={"20px"}
        >
          <Text fontSize={"20px"} fontWeight={"bold"} mt={"20px"} mb={"20px"}>
            {month}月の予定一覧
          </Text>
          {monthlyEvents.map((event, index) => (
            <Box
              key={index}
              w={"90%"}
              h={{base:"60px", md: "50px"}}
              bgColor={"white"}
              borderRadius={"10px"}
              shadow={"lg"}
              display={"flex"}
              flexDirection={{base:"column", md: "row"}}
              justifyContent={{base:"", md: "space-between"}}
              mb="10px"
            >
              <Text
                fontSize={{ base: "16px", md: "20px" }}
                fontWeight={"bold"}
                ml={{ base: "10px", md: "20px" }}
              >
                {event.title}
              </Text>
              <Flex alignItems={"center"}>
                <Text
                  fontSize={{ base: "15px", md: "19px" }}
                  mr={{ base: "18px", md: "25px" }}
                  ml={{base:"5px",md:""}}
                >
                  {formatDate(event.start)}～{formatDate(event.end)}
                </Text>
                <Button
                  colorScheme="red"
                  w={"40px"}
                  h={"30px"}
                  mr={"10px"}
                  fontSize={"14px"}
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  削除
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
      <Footer />
    </>
  );
};
