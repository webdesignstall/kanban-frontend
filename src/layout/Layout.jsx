import React, { useEffect, useState } from "react";
import { AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import AllBoards from "../components/AllBoard/AllBoards";
import AddBoardModal from "../components/AddBoardModal/AddBoardModal";
import { getAllBoards } from "../APIs/BoardAPIs";
const { Content, Sider } = Layout;

const DashboardLayout = () => {
  const [collapse, setCollapse] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIKey, setSelectedKey] = useState("");
  const [boardsData, setBoardsData] = useState([]);

  const handleMenuItemClick = (item) => {
    setSelectedKey(item.key);
  };

  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("./boards.json");
  //     const data = await res.json();
  //     const updatedItems = data.map((item) => ({
  //       label: item.name,
  //       key: item.id,
  //       icon: <AppstoreOutlined />,
  //     }));
  //     setBoardsData(updatedItems);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const data = await getAllBoards();
      const updatedItems = data?.data?.map((item) => ({
        label: item.boardName,
        key: item._id,
        icon: <AppstoreOutlined />,
      }));
      setSelectedKey(data?.data[0]?._id);
      console.log(data?.data[0]?._id);
      setBoardsData(updatedItems);
    })();
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapse}
        onCollapse={(value) => setCollapse(value)}
        // style={{ padding: "5px" }}
      >
        <div className="demo-logo-vertical" />
        <h3 style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
          All Boards
        </h3>
        <Menu
          style={{ padding: "5px" }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={boardsData}
          onClick={handleMenuItemClick}
          selectedKeys={[selectedIKey]}
        />
        {collapse ? (
          <PlusOutlined />
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            type="primary"
            style={{ width: "95%", margin: "5px" }}
          >
            <PlusOutlined /> Add New Board
          </Button>
        )}
      </Sider>
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        /> */}
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <AllBoards selectedItem={selectedIKey} />
          {isModalOpen && (
            <AddBoardModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </Content>
        {/* <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
