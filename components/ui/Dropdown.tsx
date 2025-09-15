import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DropdownProps {
  options: string[];
  defaultValue: string;
  onSelect: (index: number, value: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultValue,
  onSelect,
  style,
  textStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (index: number, value: string) => {
    setSelected(value);
    setVisible(false);
    onSelect(index, value);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, style]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.dropdownText, textStyle]}>{selected}</Text>
        <Icon name="chevron-down" size={20} color="#64748B" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    index === options.length - 1 && styles.lastOption,
                  ]}
                  onPress={() => handleSelect(index, item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 300,
    overflow: 'hidden',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#0F172A',
  },
});