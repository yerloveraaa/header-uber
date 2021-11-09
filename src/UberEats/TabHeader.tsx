import React, { RefObject, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  and,
  block,
  cond,
  greaterOrEq,
  lessThan,
  useCode,
  set,
} from "react-native-reanimated";
import Tabs from "./Tabs";
import { TabModel } from "./Content";
import MaskedView from "@react-native-community/masked-view";
import { useValues, withTransition } from 'react-native-redash';
import { interpolate } from "react-native-reanimated";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    height: 45,
    marginBottom: 8,
    flexDirection: "row",
  },
});

interface TabHeaderProps {
  tabs: TabModel[];
  transition: Animated.Node<number>;
  y: Animated.Node<number>;
  scrollView: RefObject<Animated.ScrollView>
}

export default ({ tabs, transition, y, scrollView }: TabHeaderProps) => {

  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const [index] = useValues<number>([0], [measurements]);
  const indexTransition = withTransition(index)
  const opacity = transition;
  const width = interpolate(indexTransition, {
    inputRange: tabs.map((_, i) => i),
    outputRange: measurements
  });

  const translateX = interpolate(indexTransition, {
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => {
      return (
        -1 *
          measurements.filter((_, j) => j < i).reduce((acc, m) => acc + m, 0) -
        8 * i
      );
    }),
  });
  const style = {
    borderRadius: 24,
    backgroundColor: "black",
    width,
    flex: 1,
  };

  useCode(
    () =>
      block(
        tabs.map((tab, i) =>
          cond(
            i === tabs.length - 1
              ? greaterOrEq(y, tab.anchor)
              : and(
                  greaterOrEq(y, tab.anchor),
                  lessThan(y, tabs[i + 1].anchor)
                ),
            set(index, i)
          )
        )
      ),
    [index, tabs, y]
  );
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <Tabs
          onMeasurement={(i, m) => {
            measurements[i] = m;
            setMeasurements([...measurements]);
          }}
          {...{ tabs }}
        />
      </Animated.View>

      <View>
        <Animated.View {...{ style }} />
      </View>

      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={<Animated.View {...{ style }} />}
      >
          <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <Tabs
          active
          onPress={(i) => {
           if(scrollView.current){
             scrollView.current
             .getNode()
             .scrollTo({y: tabs[i].anchor + 1})
           }
          }}
          {...{ tabs }}
        />
         </Animated.View>
      </MaskedView>
    </Animated.View>
  );
};
