import React from 'react'
import axios from 'axios';
import { Button, Form, Input, Table, message, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';


type Props = {}

const API_URL = 'http://localhost:9000/customers'

export default function Customers({ }: Props) {

    const [customers, setCustomers] = React.useState<any[]>([]);
    const [refresh, setRefresh] = React.useState<number>(0);
    const [open, setOpen] = React.useState<boolean>(false);
    const [updateId, setUpdateId] = React.useState<number>(0);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const columns: ColumnsType<any> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '1%',
            align: 'right',
        },
        {
            title: 'Họ',
            dataIndex: 'firstname',
            key: 'firstname',
            render: (text, record, index) => {
                return (<strong style={{ color: 'Blue' }}>{text}</strong>)
            }
        },
        {
            title: 'Tên',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phonenumber',
            key: 'phonenumber',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: '1%',
            render: (text, record, index) => {
                return (
                    <Space>

                        <Button icon={<EditOutlined />} onClick={() => {
                            setOpen(true);
                            setUpdateId(record.id);
                            updateForm.setFieldsValue(record);
                        }} />

                        <Button
                            danger
                            icon={<DeleteOutlined />} onClick={() => {
                                console.log(record.id);
                                axios.delete(API_URL + '/' + record.id).then(response => {
                                    setRefresh((f) => f + 1);
                                    message.success('Xóa thành công!', 1)
                                })
                            }} />

                    </Space>);
            }
        },
    ];


    //call api to get data
    React.useEffect(() => {
        axios.get(API_URL).then((response) => {
            const { data } = response;
            setCustomers(data);
            console.log(data);
        }).catch(err => {
            console.error(err);
        });
    }, [refresh])


    const onFinish = (value: any) => {
        console.log(value);
        axios.post(API_URL, value).then((response => {
            setRefresh((f) => f + 1);
            createForm.resetFields();

            message.success('Thêm mới thành công!', 1)
        })).catch((err => { }))
    };

    const onUpdateFinish = (value: any) => {
        console.log(value);
        axios.patch(API_URL +'/' + updateId, value).then((response => {
            setRefresh((f) => f + 1);
            updateForm.resetFields();

            message.success('Cập nhật thành công!', 1);
            setOpen(false);
        })).catch((err => { }))
    };

    return (
        <div>
            <div>
                <Form
                    form={createForm}
                    name='create-form'
                    onFinish={onFinish}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                >
                    <Form.Item
                        label='Họ'
                        name='firstname'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tên danh mục',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Tên'
                        name='lastname'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tên danh mục',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Số điện thoại' name='phonenumber'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Địa chỉ' name='address'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Email' name='email'>
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
            </div>
            <div>
                <Table rowKey='id' dataSource={customers} columns={columns} pagination={false} />
            
                        {/* Edit Form*/}
            <Modal open={open} title="Cập nhật danh mục"
            onCancel={()=> {setOpen(false);}}

            cancelText = 'Đóng'
            okText = 'Lưu thông tin'
            onOk={()=> {
                updateForm.submit();
            }}
            >
            <Form
                    form={updateForm}
                    name='update-form'
                    onFinish={onUpdateFinish}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                >
                    <Form.Item
                        label='Họ'
                        name='firstname'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tên danh mục',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Tên'
                        name='lastname'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tên danh mục',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Số điện thoại' name='phonenumber'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Địa chỉ' name='address'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Email' name='email'>
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
            </div>
        </div>
    )
}
