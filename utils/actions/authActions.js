import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate, logout } from "../../store/authSlice";
import BASE_URL from "../../constants/base_url";
import { getUserData } from "./userActions";

let timer;

export const signUp = ({ firstName, lastName, cochat_id, password }) => {
  return async (dispatch) => {
    try {
      // 1. 회원가입
      const response = await axios.post(`${BASE_URL}/user/`, {
        first_name: firstName,
        last_name: lastName,
        cochat_id,
        password,
      });

      // 2. 회원가입 성공 후 바로 로그인
      dispatch(signIn({ cochat_id, password }));
    } catch (error) {
      const message =
        error.response?.data?.detail || "회원가입 실패. 다시 시도하세요.";
      throw new Error(message);
    }
  };
};

export const signIn = ({ cochat_id, password }) => {
  return async (dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("username", cochat_id);
      params.append("password", password);

      const response = await axios.post(`${BASE_URL}/token`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, token_type, user_id } = response.data;

      const expiryDate = new Date(
        new Date().getTime() + 60 * 60 * 1000 // 1시간짜리 JWT 토큰 가정
      );

      const userData = await getUserData(user_id, access_token);

      dispatch(
        authenticate({
          token: access_token,
          userData,
        })
      );

      saveDataToStorage(access_token, cochat_id, expiryDate);

      timer = setTimeout(() => {
        dispatch(userLogout());
      }, 60 * 60 * 1000);
    } catch (error) {
      console.log(error);
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    await AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  };
};

export const updateSignedInUserData = async (userId, newData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/${userId}/update`,
      {
        first_name: newData.first_name,
        last_name: newData.last_name,
        cochat_id: newData.cochat_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const saveDataToStorage = (token, cochat_id, expiryDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      cochat_id,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
