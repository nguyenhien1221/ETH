import {
  hostName,
  readMethodsValue,
  writeMethodsValue,
} from "../features/constants";

export const convertData = data => {
  return data === undefined ? "" : String(data);
};

export const handleError = () => {
  alert("Transaction failed");
};

export const handleCopyMethod = method => {
  navigator.clipboard.writeText(method);
};

export const handleCopyLink = (text, action) => {
  const methodValues = action === "read" ? readMethodsValue : writeMethodsValue;
  navigator.clipboard.writeText(`${hostName}/${action}/${methodValues[text]}`);
};
