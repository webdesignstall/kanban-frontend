import React, { useState } from "react";
import { AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import AllBoards from "../components/AllBoard/AllBoards";
import AddBoardModal from "../components/AddBoardModal/AddBoardModal";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Board 1", "1", <AppstoreOutlined />),
  getItem("Board 2", "2", <AppstoreOutlined />),
];

const DashboardLayout = () => {
  const [collapse, setCollapse] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIKey, setSelectedKey] = useState("1");
  const [selectedItem, setSelectedItem] = useState("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuItemClick = (item) => {
    setSelectedKey(item.key);
    const sItem = items.find((itm) => itm.key === item.key);
    setSelectedItem(sItem.label);
  };

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
      >
        <div className="demo-logo-vertical" />
        <h3 style={{ color: "white", textAlign: "center" }}>All Boards</h3>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuItemClick}
          selectedKeys={[selectedIKey]}
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          type="primary"
          style={{ width: "100%" }}
        >
          <PlusOutlined /> Add New Board
        </Button>
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
          <AllBoards selectedItem={selectedItem} />
          {isModalOpen && (
            <AddBoardModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
