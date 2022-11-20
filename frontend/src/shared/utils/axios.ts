import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const myAxios = axios.create({
  withCredentials: true,
});

export const myAxiosPost = (
  endPoint: string,
  formData?: FormData,
  config?: AxiosRequestConfig<FormData> | undefined,
) => {
  return myAxios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`, formData, config);
};

export const myAxiosGet = <T extends any>(
  endPoint: string,
  config?: AxiosRequestConfig<FormData> | undefined,
) => {
  return myAxios.get<any, AxiosResponse<T, any>, any>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`,
    config,
  );
};

export const myAxiosPatch = (
  endPoint: string,
  data?: URLSearchParams | undefined,
  config?: AxiosRequestConfig<URLSearchParams> | undefined,
) => {
  return myAxios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`, data, config);
};
