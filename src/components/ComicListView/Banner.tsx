import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import Slide from "./Slide";

const { width, height } = Dimensions.get("window");

function infiniteScroll(dataList: any, GflatList: any) {
  const numberOfData = dataList.length;
  let scrollValue = 0,
    scrolled = 0;

  return setInterval(function () {
    scrolled++;
    if (scrolled < numberOfData) scrollValue = scrollValue + width;
    else {
      scrollValue = 0;
      scrolled = 0;
    }

    GflatList.scrollToOffset({ animated: true, offset: scrollValue });
  }, 3000);
}

const Banner = ({ data }: any) => {
  let GflatList: any = {};
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [dataList, setDataList] = useState(data);

  useEffect(() => {
    setDataList(data);
    const interval = infiniteScroll(dataList, GflatList);
    return () => clearInterval(interval);
  });

  if (data && data.length) {
    return (
      <View>
        <FlatList
          data={data}
          ref={(flatList) => {
            GflatList = flatList;
          }}
          keyExtractor={(item, index) => "key" + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <Slide item={item} />;
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: scrollX } } },
          ])}
        />

        <View style={styles.dotView}>
          {data.map((_: any, i: any) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={{
                  opacity,
                  height: 10,
                  width: 10,
                  backgroundColor: "#595959",
                  margin: 8,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  dotView: { flexDirection: "row", justifyContent: "center" },
});

export default Banner;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   FlatList,
//   Animated,
// } from "react-native";
// import Slide from "./Slide";

// const { width, height } = Dimensions.get("window");

// function infiniteScroll(dataList: any, GflatList: any) {
//   const numberOfData = dataList.length;
//   let scrollValue = 0,
//     scrolled = 0;

//   return setInterval(function () {
//     scrolled++;
//     if (scrolled < numberOfData) scrollValue = scrollValue + width;
//     else {
//       scrollValue = 0;
//       scrolled = 0;
//     }

//     GflatList.scrollToOffset({ animated: true, offset: scrollValue });
//   }, 3000);
// }

// const Banner = ({ data }: any) => {
//   let GflatList: any = {};
//   const scrollX = new Animated.Value(0);
//   let position = Animated.divide(scrollX, width);
//   const [dataList, setDataList] = useState(data);

//   useEffect(() => {
//     setDataList(data);
//     const interval = infiniteScroll(dataList, GflatList);
//     return () => clearInterval(interval);
//   });

//   const AnimatedFlatlist = Animated.createAnimatedComponent(ClassList);

//   if (data && data.length) {
//     return (
//       <View>
//         <AnimatedFlatlist
//           setGflatList={(flatList: any) => (GflatList = flatList)}
//           data={data}
//           scrollX={scrollX}
//         />
//         {/* <View style={styles.dotView}>
//           {data.map((_: any, i: any) => {
//             let opacity = position.interpolate({
//               inputRange: [i - 1, i, i + 1],
//               outputRange: [0.3, 1, 0.3],
//               extrapolate: "clamp",
//             });
//             return (
//               <Animated.View
//                 key={i}
//                 style={{
//                   opacity,
//                   height: 10,
//                   width: 10,
//                   backgroundColor: "#595959",
//                   margin: 8,
//                   borderRadius: 5,
//                 }}
//               />
//             );
//           })}
//         </View> */}
//       </View>
//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   dotView: { flexDirection: "row", justifyContent: "center" },
// });

// export default Banner;

// type ClassListProps = {
//   data: any;
//   setGflatList: any;
//   scrollX: any;
// };

// class ClassList extends React.Component<ClassListProps, any> {
//   render() {
//     return (
//       <FlatList
//         data={this.props.data}
//         ref={(flatList) => {
//           this.props.setGflatList(flatList);
//         }}
//         keyExtractor={(item, index) => "key" + index}
//         horizontal
//         pagingEnabled
//         scrollEnabled
//         snapToAlignment="center"
//         scrollEventThrottle={16}
//         decelerationRate={"fast"}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => {
//           return <Slide item={item} />;
//         }}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: this.props.scrollX } } }]
//           // { useNativeDriver: true }
//         )}
//       />
//     );
//   }
// }