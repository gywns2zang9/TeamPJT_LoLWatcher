import axiosInstance from "./axiosInstance";

// 전적 검색
// export const getGameRecords = async (accessToken: string) => {
//   const response = await axiosInstance.get("/user/records", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return response.data.transactions;
// };

// 유저 정보 검색
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/user/profile");

  return response.data;
};
