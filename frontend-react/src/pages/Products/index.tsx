import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import axios from "../../libraries/axiosClient";
import React, { useCallback, useMemo } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Styles from "./css.module.css";
import { useNavigate } from "react-router-dom";

import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";

const apiName = "/products";

const initialState = {
  category: "",
  supplier: "",
  productName: "",
  stockStart: "",
  stockEnd: "",
  priceStart: "",
  priceEnd: "",
  discountStart: "",
  discountEnd: "",
};

export default function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSuppliers] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalProducts, setTotalProducts] = React.useState<number>(0);
  const navigate = useNavigate();

  const [updateForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = React.useState("");

  const onChangFilter = useCallback((e: any) => {
    setFilter((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const callApi = useCallback((searchParams: any) => {
    axios
      .get(`${apiName}?${searchParams}`)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  
  const resetFilter = useCallback(() => {
    setFilter(initialState);
    // callApi();
  }, []);

  // const onSearch = useCallback(() => {
  //   callApi(searchParams);
  //   setFilter(initialState);
  // }, []);
  const onSearch = useCallback(() => {
    const { category, supplier, productName, stockStart, stockEnd, priceStart, priceEnd, discountStart, discountEnd } = filter;
    const params = new URLSearchParams({
      category,
      supplier,
      productName,
      stockStart,
      stockEnd,
      priceStart,
      priceEnd,
      discountStart,
      discountEnd,
      q: searchTerm, // Thêm giá trị tìm kiếm vào URL
      apiName,
    });
    setCurrentPage(1);
    axios
      .get(`${apiName}?${params.toString()}`)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload);       
        setTotalProducts(data.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [apiName, filter, searchTerm]);
  
  

  const create = () => {
    navigate("/product");
  };

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "category.name",
      key: "category.name",
      render: (text, record, index) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier.name",
      key: "supplier.name",
      render: (text, record, index) => {
        return <span>{record.supplier.name}</span>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Giảm giá</div>;
      },
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Tồn kho</div>;
      },
      dataIndex: "stock",
      key: "stock",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Mô tả / Ghi chú",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: "",
    //   dataIndex: "actions",
    //   key: "actions",
    //   width: "1%",
    //   render: (text, record, index) => {
    //     return (
    //       <Space>
    //         <Button
    //           icon={<EditOutlined />}
    //           onClick={() => {
    //             setOpen(true);
    //             setUpdateId(record.id);
    //             updateForm.setFieldsValue(record);
    //           }}
    //         />
    //         <Button
    //           danger
    //           icon={<DeleteOutlined />}
    //           onClick={() => {
    //             console.log(record.id);
    //             axios.delete(apiName + "/" + record.id).then((response) => {
    //               setRefresh((f) => f + 1);
    //               message.success("Xóa danh mục thành công!", 1.5);
    //             });
    //           }}
    //         />
    //       </Space>
    //     );
    //   },
    // },
    {
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record.id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record.id);
                axios.delete(apiName + "/" + record.id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success("Xóa danh mục thành công!", 1.5);
                });
              }}
            />
          </Space>
        );
      },
      title: (
        <Button
          style={{
            marginBottom: "10px",
            float: "right",
            border: "1px solid black",
            width: "auto",
          }}
          onClick={create}
        >
          + Thêm sản phẩm
        </Button>
      ),
    },
  ];

  /* React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]); */

  // Get products
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  // Get categories
  React.useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        const { data } = response;
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get("/suppliers")
      .then((response) => {
        const { data } = response;
        setSuppliers(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* TABLE */}
      <div className={Styles.filter}>
        <select
          className={Styles.select}
          id="cars"
          name="category"
          onChange={onChangFilter}
        >
          {categories.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <select
          className={Styles.select}
          id="cars"
          name="supplier"
          onChange={onChangFilter}
        >
          {suppliers.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <Input
          placeholder="Tìm kiếm sản phẩm"
          name="productName"
          value={filter.productName}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Tồn kho thấp nhất"
          name="stockStart"
          value={filter.stockStart}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Tồn kho cao nhất"
          name="stockEnd"
          value={filter.stockEnd}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Giá thấp nhất"
          name="priceStart"
          value={filter.priceStart}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Giá cao nhất"
          name="priceEnd"
          value={filter.priceEnd}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Giảm giá thấp nhất"
          name="discountStart"
          value={filter.discountStart}
          onChange={onChangFilter}
              
          allowClear
        />
        <Input
          placeholder="Giám giá cao nhất"
          name="discountEnd"
          value={filter.discountEnd}
          onChange={onChangFilter}
              
          allowClear
        />
        <Button className={Styles.button} onClick={onSearch}>
          Tìm Kiếm
        </Button>
        <Button className={Styles.button} onClick={resetFilter}>
          Tất Cả
        </Button>
      </div>
      <Table
        className={Styles.table}
        rowKey="id"
        dataSource={products}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: totalProducts,
          onChange: onPageChange,
        }}
      />

      {/* EDIT FORM */}
      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Danh mục sản phẩm"
            name="categoryId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Danh mục sản phẩm bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhà cung cấp bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
