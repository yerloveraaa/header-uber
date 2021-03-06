import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { Extrapolate, interpolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const { height: wHeight, width: wWidth } = Dimensions.get("window");
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const backgroundImage = require("./assets/background.jpeg");

export const HEADER_IMAGE_HEIGHT = wHeight / 3;
const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wWidth,
    resizeMode: "cover",
    height: HEADER_IMAGE_HEIGHT,
  },
});

interface HeaderImageProps {
  y: Animated.Node<number>;
}

export default ({ y }: HeaderImageProps) => {
  const height = interpolate(y, {
    inputRange: [-100, 0],
    outputRange: [HEADER_IMAGE_HEIGHT + 100, HEADER_IMAGE_HEIGHT],
    extrapolateRight: Extrapolate.CLAMP,
  });
  const top = interpolate(y, {
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolateLeft: Extrapolate.CLAMP,
  });
  return (
    <Animated.Image
      source={backgroundImage}
      style={[styles.image, { height, top }]}
    />
  );
};
