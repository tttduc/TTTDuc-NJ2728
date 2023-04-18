import { Button, Form, Input, message } from "antd";
import axios from "../../libraries/axiosClient";
import React from "react";
import { useNavigate } from "react-router-dom";

const apiName = "/categories";

export default function Categories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const navigate = useNavigate();

  const [createForm] = Form.useForm();

  // Call api to get data
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setCategories(data);
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
        message.success("Thêm mới danh mục thành công!", 1.5);
        navigate("/categories");
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{}}>
        {/* CREAT FORM */}
        <Form
          form={createForm}
          name="create-form"
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên danh mục bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả / Ghi chú" name="description">
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" >
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
