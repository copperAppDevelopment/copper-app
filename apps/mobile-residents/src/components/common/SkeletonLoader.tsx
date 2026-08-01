import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewStyle, DimensionValue, StyleProp } from 'react-native';

interface BaseProps {
  style?: StyleProp<ViewStyle>;
}

interface RectProps extends BaseProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

interface CircleProps extends BaseProps {
  size?: number;
}

interface TextLineProps extends BaseProps {
  width?: DimensionValue;
  height?: number;
}

export function SkeletonLoader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Componente animado base
const Pulse = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

SkeletonLoader.Rect = function SkeletonRect({ width = '100%', height = 50, borderRadius = 8, style }: RectProps) {
  return (
    <Pulse
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={styles.content} />
    </Pulse>
  );
};

SkeletonLoader.Circle = function SkeletonCircle({ size = 48, style }: CircleProps) {
  return (
    <Pulse
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Animated.View style={styles.content} />
    </Pulse>
  );
};

SkeletonLoader.TextLine = function SkeletonTextLine({ width = '80%', height = 12, style }: TextLineProps) {
  return (
    <Pulse
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: height / 2,
          marginVertical: 4,
        },
        style,
      ]}
    >
      <Animated.View style={styles.content} />
    </Pulse>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#e2e8f0', // Color gris suave de Tailwind (slate-200)
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
