import { notification } from "antd";

export const errorNotification = message => {
  return notification.error({ message: message });
};
