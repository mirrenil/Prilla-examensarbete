import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { View, Text } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Tag } from "../Interfaces";
import Colors from "../constants/Colors";

interface Props {
  handleInput: (a: Tag[]) => void;
}

const Tags = ({ handleInput }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const colorScheme: any = useColorScheme();

  const styles = StyleSheet.create({
    tagsSection: {},
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    tag: {
      padding: 10,
      margin: 7,
      borderWidth: 1,
      borderColor: "#783BC9",
      borderRadius: 6,
    },
    selected: {
      // backgroundColor: "#783BC9",
      backgroundColor: Colors[colorScheme].section,
      color: "white",
      opacity: 0.9,
    },
    sectionTitle: {
      paddingBottom: 10,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      let tags = await getAllDocsInCollection("tags");
      setTags(tags as Tag[]);
    } catch (err) {
      console.log(err);
    }
  };

  const isAlreadySelected = (tag: Tag) => {
    let selected = selectedTags.some(
      (selectedTag) => selectedTag.name == tag.name
    );
    return selected;
  };

  const removeSelectedTag = (tag: Tag) => {
    let newList = selectedTags.filter(
      (selectedTag) => tag.name !== selectedTag.name
    );
    handleInput(newList);
    setSelectedTags(newList);
  };

  const toggleSelectTag = (tag: Tag) => {
    if (!isAlreadySelected(tag)) {
      let list = selectedTags;
      list.push(tag);
      handleInput(list);
      setSelectedTags(list);
    } else {
      removeSelectedTag(tag);
    }
  };

  return (
    <View style={[styles.tagsSection]}>
      <Text style={styles.sectionTitle}>Välj taggar</Text>
      <View style={styles.tags}>
        {tags.map((tag) => {
          let isSelected: boolean = isAlreadySelected(tag);
          return (
            <Pressable
              style={() => [styles.tag, isSelected ? styles.selected : null]}
              onPress={() => {
                isSelected = !isSelected;
                toggleSelectTag(tag);
              }}
            >
              <Text>{tag.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Tags;
