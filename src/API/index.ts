import axios from "axios";
import { AuthInfo, InvitationInfo, MessageInfo } from "types/type";

// const GATEWAY_URL = `https://chatting-backend-c0nt.onrender.com/api`;
const GATEWAY_URL = process.env.GATEWAY_URL;

export const login = async (loginInfo: AuthInfo) =>
  await axios({
    method: "post",
    url: `${GATEWAY_URL}/users/login`,
    data: {
      ...loginInfo,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

export const register = async (registerInfo: AuthInfo) =>
  await axios({
    method: "post",
    url: `${GATEWAY_URL}/users/register`,
    data: {
      ...registerInfo,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

export const connect = async (invitationInfo: InvitationInfo) =>
  await axios({
    method: "post",
    url: `${GATEWAY_URL}/connect`,
    data: {
      ...invitationInfo,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

export const getAllConnections = async (userId: string) =>
  await axios({
    method: "get",
    url: `${GATEWAY_URL}/connections/${userId}`,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

export const insertMessage = async (messageInfo: MessageInfo) =>
  await axios({
    method: "post",
    url: `${GATEWAY_URL}/message`,
    data: {
      ...messageInfo,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

export const queryMessagesByConnectionId = async (connectionId: string) =>
  await axios({
    method: "get",
    url: `${GATEWAY_URL}/messages/${connectionId}`,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
