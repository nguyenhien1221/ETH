import React from "react";
import "../Form/FormBox.css";
import { Form, Button, Space } from "antd";

const FormBox = ({
  children,
  submitText,
  onSubmit,
  isDisableSubmitBtn = true,
  contractHash,
}) => {
  const [form] = Form.useForm();

  const onFinish = (data) => {
    onSubmit(data);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {children}
        <Space>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isDisableSubmitBtn}
            >
              {submitText}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              className={!contractHash ? "hide_btn" : undefined}
              type="primary"
            >
              <a
                href={`https://sepolia.etherscan.io/tx/${contractHash}`}
                target="blank"
              >
                View your transaction
              </a>
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default FormBox;
