// StAuth10244: I Callum Mckail, 000376091 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
// Background image sourced from https://playvalorant.com/en-us/media/wallpapers
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import axios from "axios";

const Card = ({ agent }) => (
  <View style={styles.card}>
    <Text style={styles.heading2}>{agent.displayName}</Text>
    <Image
      style={{ width: 150, height: 200 }}
      source={{
        uri: agent.bustPortrait,
      }}
    />
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <Text style={{ marginRight: 5, fontWeight: "500", fontSize: 15 }}>
        Role:
      </Text>
      <Image
        style={{
          backgroundColor: "grey",
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "black",
        }}
        source={{
          uri: agent.role.displayIcon,
        }}
      />
      <Text style={{ marginLeft: 5 }}>{agent.role.displayName}</Text>
    </View>
  </View>
);

const AgentView = ({ agent }) => (
  <SafeAreaView style={{ flex: 1, width: "80%" }}>
    <View>
      <Text style={styles.headingLight}>{agent.displayName}</Text>
      <Image
        style={{ width: 300, height: 300, alignSelf: "center" }}
        source={{
          uri: agent.fullPortrait,
        }}
      />
    </View>

    <View>
      <Text style={styles.heading2Light}>Description:</Text>
      <Text style={styles.paragraphLight}>{agent.description}</Text>
    </View>

    <View>
      <Text style={styles.heading2Light}>Role:</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Image style={styles.icon} source={{ uri: agent.role.displayIcon }} />
        <Text
          style={{
            marginLeft: 10,
            fontSize: 15,
            fontWeight: "600",
            color: "white",
          }}
        >
          {agent.role.displayName}
        </Text>
      </View>
      <Text style={styles.paragraphLight}>{agent.role.description}</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.heading2Light}>Abilities:</Text>
      <FlatList
        style={{ marginVertical: 10 }}
        data={agent.abilities}
        renderItem={({ item }) => (
          <View>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Image style={styles.icon} source={{ uri: item.displayIcon }} />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 15,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {item.displayName}
              </Text>
            </View>
            <Text style={styles.paragraphLight}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  </SafeAreaView>
);

export default function App() {
  const [content, setContent] = useState([]);
  const [selectedAgent, setAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);

  // Queries the Valorant Web Service to retrieve all agents
  async function getAllAgents() {
    try {
      const response = await axios.get(
        "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
      );

      // use the data key of the response body to access the response data
      setContent(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Queries the Valorant Web Service to retrieve a single agent based on the UUID passed in via agentId
  // Params: agentId - The uuid of the agent to retrieve from the web service
  async function getAgent(agentId) {
    try {
      const response = await axios.get(
        "https://valorant-api.com/v1/agents/" + agentId
      );

      // axios returns back a response a object, we're interested in the data key that
      // contains the response body
      console.log(response.data.data);

      // use the data key of the response body to access the response data
      setAgent(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Filters the agents displayed via a searchTerm passed into the function
  //Params: searchTerm - The string used to filter the content array
  async function searchRoles(searchTerm) {
    console.log(searchTerm);

    // Filter the content array using the searchTerm provided by the user
    let filtered_content = content.filter(
      (item) => item.role.displayName.toLowerCase() === searchTerm.toLowerCase()
    );

    if (filtered_content.length > 0) {
      setSearchResults(filtered_content);
      setSearchError(false);
    } else {
      setSearchError(true);
    }
  }

  useEffect(() => {
    getAllAgents();
  }, []);

  if (!selectedAgent) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ImageBackground source={require("./assets/VALORANT_Logo_V.jpg")}>
          <StatusBar backgroundColor="#61dafb" barStyle="light-content" />
          <View style={styles.contentContainer}>
            <View style={styles.cardContainer}>
              <FlatList
                numColumns={2}
                data={searchResults.length > 0 ? searchResults : content}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ width: "50%" }}
                    id={item.uuid}
                    onPress={() => getAgent(item.uuid)}
                  >
                    <Card style={{}} agent={item} />
                  </Pressable>
                )}
                keyExtractor={(item) => item.uuid}
              />
            </View>
            <View style={styles.controlBar}>
              <Text style={styles.heading2Light}>Filter By Role:</Text>
              <TextInput
                style={styles.input}
                value={searchTerm}
                onChangeText={(text) => {
                  setSearchTerm(text);
                  setSearchError(false);
                }}
              ></TextInput>
              {searchError && (
                <Text style={{ color: "red" }}>No role named {searchTerm}</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Pressable
                  onPress={async () => {
                    await searchRoles(searchTerm);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#1f1f1f" : "#ff4655",
                    },
                    styles.button,
                  ]}
                >
                  <Text style={styles.heading2Light}>Filter</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                    setSearchError(false);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#1f1f1f" : "#ff4655",
                    },
                    styles.button,
                  ]}
                >
                  <Text style={styles.heading2Light}>Reset Filter</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#1f1f1f" barStyle={"light-content"} />
        <View style={{ marginVertical: 10 }}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#1f1f1f" : "#ff4655",
                borderRadius: "20%",
                padding: 8,
                marginTop: 15,
              },
            ]}
            onPress={() => setAgent(null)}
          >
            <Text style={[styles.heading2Light]}>Back to All Agents</Text>
          </Pressable>
        </View>
        <View>
          <AgentView agent={selectedAgent} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1923",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
  },
  contentContainer: {
    marginTop: 50,
    minWidth: "100%",
  },
  cardContainer: {
    flex: 5,
    minWidth: "100%",
  },
  card: {
    alignItems: "center",
    borderColor: "black",
    borderWidth: 3,
    backgroundColor: "white",
    borderRadius: 20,
    margin: "1%",
    width: "98%",
  },
  controlBar: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1f1f1f",
  },
  controls: {
    marginVertical: 10,
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#ff4655",
    borderRadius: "20%",
    padding: 4,
    marginTop: 15,
    alignItems: "center",
    width: "45%",
    alignSelf: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    color: "white",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
  },
  heading2: {
    fontSize: 16,
    fontWeight: "700",
  },
  paragraph: {
    marginVertical: 10,
  },
  headingLight: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  heading2Light: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  paragraphLight: {
    marginVertical: 10,
    color: "white",
  },
  input: {
    height: 30,
    margin: 0,
    borderWidth: 1,
    padding: 0,
    borderColor: "white",
    color: "white",
  },
  icon: {
    width: 30,
    height: 30,
    backgroundColor: "grey",
  },
});
