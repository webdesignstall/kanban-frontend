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
  const [refetchBoard, setRefetchBoard] = useState(false);

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
      setBoardsData(updatedItems);
    })();
  }, [refetchBoard]);

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
        {collapse ? (
          <h4
            style={{
              color: "white",
              textAlign: "center",
              marginTop: "10px",
              fontFamily: "sans-serif",
              fontSize: "15px",
            }}
          >
            BOARDS
          </h4>
        ) : (
          <h4
            style={{
              color: "white",
              textAlign: "center",
              marginTop: "10px",
              fontFamily: "sans-serif",
              fontSize: "25px",
            }}
          >
            ALL BOARDS
          </h4>
        )}

        <Menu
          style={{ padding: "5px" }}
          theme="dark"
          defaultSelectedKeys={[selectedIKey]}
          mode="inline"
          items={
            collapse
              ? boardsData?.concat({
                  label: "Add",
                  key: boardsData?.length + 1,
                  icon: (
                    <PlusOutlined
                      onClick={() => setIsModalOpen(true)}
                      style={{
                        color: "white",
                      }}
                    />
                  ),
                })
              : boardsData
          }
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
              setRefetchBoard={setRefetchBoard}
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
