import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { View, Text } from '../components/Themed';
import { getAllDocsInCollection } from '../helper';
import { Tag } from '../Interfaces';

const Tags = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

	const styles = StyleSheet.create({
		tagsSection: {},
		tags: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		tag: {
			padding: 10,
			margin: 7,
			borderWidth: 1,
			borderColor: 'white',
			borderRadius: 6,
		},
		selected: {
			backgroundColor: 'rgba(255,255,255,0.4)',
		},
		sectionTitle: {
			paddingBottom: 10,
			fontSize: 16,
			fontWeight: 'bold',
		},
	});

	useEffect(() => {
		getTags();
	}, []);

	const getTags = async () => {
		try {
			let tags = await getAllDocsInCollection('tags');
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
    let newList = selectedTags.filter((selectedTag) => tag.name !== selectedTag.name)
    setSelectedTags(newList);
  }

	const toggleSelectTag = (tag: Tag) => {
		if (!isAlreadySelected(tag)) {
			let list = selectedTags;
			list.push(tag);
			setSelectedTags(list);
		} else {
      removeSelectedTag(tag)
    }
	};

	return (
		<View style={[styles.tagsSection]}>
			<Text style={styles.sectionTitle}>Välj taggar</Text>
			<View style={styles.tags}>
				{tags.map((tag) => {
					let isSelected: boolean = false;

					return (
						<Pressable
							style={() => [styles.tag, isSelected ? styles.selected : null]}
							onPress={() => {
								isSelected = !isSelected;
								toggleSelectTag(tag);
							}}
						>
							<View>
								<Text>{tag.name}</Text>
							</View>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default Tags;
