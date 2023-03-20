import React from 'react'
import axios from 'axios';
import { Button, Form, Input, Table, message, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';


type Props = {}

const API_URL = 'http://localhost:9000/orders'

export default function Orders({ }: Props) {

    const [orders, setOrders] = React.useState<any[]>([]);
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
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                return (<strong style={{ color: 'Blue' }}>{text}</strong>)
            }
        },
        {
            title: 'Mô tả/ Ghi chú',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
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

                    </Space>
                );
            }
        },
    ];


    //call api to get data
    React.useEffect(() => {
        axios.get(API_URL).then((response) => {
            const { data } = response;
            setOrders(data);
            console.log(data);
        }).catch(err => {
            console.error(err);
        });
    }, [refresh])


    const onFinish = (value: any) => {
        console.log(value);
        axios
        .post(API_URL, value)
        .then((response => {
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
                {/* Created Form*/}
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
                        label='Tình trạng'
                        name='status'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tình trạng',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Mô tả/ Ghi chú' name='description'>
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
            
                <Table rowKey='id' dataSource={orders} columns={columns} pagination={false} />
            
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
                        label='Tình trạng'
                        name='status'
                        hasFeedback
                        required={true} rules={[
                            {
                                required: true,
                                message: 'Bắt buộc phải có tình trạng',
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Mô tả/ Ghi chú' name='description'>
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
            </div>
        </div>
    )
}
