import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

interface DataType {
  key: React.Key;
  vorname: string;
  nachname: string;
  bier: number;
  softdrinks: number;
  monatsbeitrag: number;
  sonstige_kosten: number;
  gesamtkosten: number;
}

const serverIP = "192.168.178.160"

const columns: TableColumnsType<DataType> = [
  {
    title: "Vorname",
    dataIndex: "vorname",
    width: 100, // Breite der Spalte in Pixeln
  },
  {
    title: "Nachname",
    dataIndex: "nachname",
    width: 100,
  },
  {
    title: "Bier",
    dataIndex: "bier",
    width: 50,
  },
  {
    title: "Softdrinks",
    dataIndex: "softdrinks",
    width: 100,
  },
  {
    title: "Monatsbeitrag",
    dataIndex: "monatsbeitrag",
    width: 100,
  },
  {
    title: "Sonstige Kosten",
    dataIndex: "sonstige_kosten",
    width: 120,
  },
  {
    title: "Gesamtkosten",
    dataIndex: "gesamtkosten",
    width: 120,
  },
];

function Admin() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [selectedRow, setSelectedRow] = useState<DataType | undefined>(
    undefined
  );
  const [tableData, setTableData] = useState<DataType[]>([]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const rowKey = selectedRowKeys[0];
      const selectedRow: DataType = selectedRows[0];
      console.log(selectedRow);
      setSelectedRow(selectedRow);
    },
  };

  useEffect(() => {
    try {
      axios
        .get<DataType[]>("http://" + serverIP + ":3000/api/table", {
          headers: {
            Authorization: authHeader,
          },
        })
        .then((res) => {
          setTableData(res.data);
        });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  const onSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          padding: "30px",
          top: 0,
          borderBottom: "2px solid",
          borderColor: "grey",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>SG Alftal</h1>
        <Button
          onClick={onSignOut}
          style={{
            backgroundColor: "#4285f4",
            borderColor: "#4285f4",
            color: "white",
            marginRight: "20px",
          }}
        >
          Logout
        </Button>
      </div>
      <div style={{ marginBottom: "30px" }}></div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          style={{ width: "70%" }}
          scroll={{ y: 400 }} // Set the height of the table to 400px
          columns={columns}
          dataSource={tableData}
        />
      </div>
      <div style={{ marginBottom: "20px" }}></div>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <Card title="Edit Row" bordered={true} style={{ width: "70%", borderColor: "black" }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    </>
  );
}
export default Admin;
