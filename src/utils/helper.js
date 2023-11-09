import { TOKEN_CONTRACT } from "../features/constants";

export const HOST_NAME = window.location.host;

export const convertData = data => {
  return data ?? "";
};

export const handleCopyMethod = method => {
  navigator.clipboard.writeText(method);
};

export const handleCopyLink = (method, action) => {
  navigator.clipboard.writeText(
    `${HOST_NAME}/token/${TOKEN_CONTRACT}#${action}#${method}`
  );
};
