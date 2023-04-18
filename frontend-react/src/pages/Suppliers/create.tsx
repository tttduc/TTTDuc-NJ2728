import {
    Button,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Space,
    Table,
  } from "antd";
  import axios from "../../libraries/axiosClient";
import React from "react";
 
 const apiName = "/suppliers";

 export default function Suppliers() {
 
    const [refresh, setRefresh] = React.useState<number>(0);
    const [createForm] = Form.useForm();
 
 
 
 
 
 
 const onFinish = (values: any) => {
    console.log(values);

    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới danh mục thành công!", 1.5);
      })
      .catch((err) => {});
  };
 
 
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
   label="Name"
   name="name"
   hasFeedback
   required={true}
   rules={[
     {
       required: true,
       message: "Tên bắt buộc phải nhập",
     },
   ]}
 >
   <Input />
 </Form.Item>

 <Form.Item label="Phone Number" name="phoneNumber" hasFeedback>
   <Input />
 </Form.Item>

 <Form.Item label="Address" name="address" hasFeedback>
   <Input />
 </Form.Item>

 <Form.Item label="Email" name="email" hasFeedback>
   <Input />
 </Form.Item>

 <Form.Item
   wrapperCol={{
     offset: 8,
     span: 16,
   }}
 >
   <Button type="primary" htmlType="submit">
     Lưu thông tin
   </Button>
 </Form.Item>
</Form>
 }