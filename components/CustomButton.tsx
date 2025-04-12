import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ViewStyle, TextStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center   ${disabled ? 'opacity-50' : ''} ${className}`}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`font-semibold text-white ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
