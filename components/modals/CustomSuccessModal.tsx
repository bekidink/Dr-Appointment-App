import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  isLoading: boolean;
}

const CustomSuccessModal = ({ isVisible, message, onClose, isLoading }: Props) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.7}>
      <View className="items-center justify-center rounded-lg bg-white p-5">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FontAwesome name="check-circle" size={50} color="green" />
        )}
        <Text className="mt-4 text-center text-lg font-semibold">{message}</Text>
        <Pressable onPress={onClose} className="mt-5 rounded-full bg-blue-500 px-6 py-3">
          <Text className="text-center text-white">Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default CustomSuccessModal;
