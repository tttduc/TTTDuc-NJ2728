import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "../../libraries/axiosClient";
import { useNavigate } from "react-router-dom";

const apiName = "/suppliers";

export default function Suppliers() {
  const [suppliers, setSuppliers] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const navigate = useNavigate();

  const [createForm] = Form.useForm();

  React.useEffect(() => {
    // Call api
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setSuppliers(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onFinish = (values: any) => {
    console.log(values);

    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới nhà cung cấp thành công!", 1.5);
        navigate("/suppliers")
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        {/* CREATE FORM */}
        <Form
          form={createForm}
          name="Create-form"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="phoneNumber"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa Chỉ"
            name="address"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}