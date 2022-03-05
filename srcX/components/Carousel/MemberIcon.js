import React, { Component } from "react";
import { View, StyleSheet, Image as IMG } from "react-native";
import Canvas, { Image as CanvasImage } from "react-native-canvas";

function clearCircle(context, x, y, radius) {
  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, true);
  context.clip();
  context.clearRect(x - radius, y - radius, radius * 2, radius * 2);
  context.restore();
}
export default class MemberIcon extends Component {
  handleCanvas = (canvas) => {
    if (canvas) {
      const image = new CanvasImage(canvas, 25, 25);
      canvas.width = 25;
      canvas.height = 25;
      image.src = this.props.image;
      const ctx = canvas.getContext("2d");
      image.addEventListener("load", () => {
        ctx.drawImage(image, 0, 0, 25, 25);
        clearCircle(ctx, /*x=*/ -4, /*y=*/ 12.5, /*radius=*/ 13.5);
      });
    }
  };
  render() {
    return (
      <View style={{ width: 20 }}>
        {this.props.index === 0 ? (
          <IMG
            style={{
              width: 25,
              height: 25,
              borderRadius: 16,
              overflow: "hidden",
            }}
            source={{ uri: this.props.image }}
          />
        ) : (
          <Canvas
            height={25}
            width={25}
            style={styles.canvas}
            ref={this.handleCanvas}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  canvas: {
    top: 0,
    left: 0,
    padding: 0,
    margin: 0,
    borderRadius: 12.5,
    width: 25,
    height: 25,
    backgroundColor: "transparent",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 16,
    overflow: "hidden",
  },
});
