import { useState, useEffect } from "react";
import { Text, View } from "react-native";

const Total = (props) => {
  const calculateTotal = props.getTotal;

  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log("calculating!");
    setTotal(calculateTotal());
  }, [calculateTotal]);

  return (
    <View>
      <Text>{`Total: ₩${total}`}</Text>
    </View>
  );
};

export default Total;
