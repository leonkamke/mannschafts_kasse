import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Divider} from "antd";

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

const serverIP = "localhost"; //""192.168.178.160"

const columns: TableColumnsType<DataType> = [
  {
    title: "Vorname",
    dataIndex: "vorname",
    width: 120, // Breite der Spalte in Pixeln
  },
  {
    title: "Nachname",
    dataIndex: "nachname",
    width: 120,
  },
  {
    title: "Bier",
    dataIndex: "bier",
    width: 70,
  },
  {
    title: "Softdrinks",
    dataIndex: "softdrinks",
    width: 100,
  },
  {
    title: "Monatsbeitrag",
    dataIndex: "monatsbeitrag",
    width: 150,
  },
  {
    title: "Sonstige Kosten",
    dataIndex: "sonstige_kosten",
    width: 120,
  },
  {
    title: "Gesamtkosten",
    dataIndex: "gesamtkosten",
    width: 130,
  },
];

function User() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [tableData, setTableData] = useState<DataType[]>([]);

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
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "10px",
          top: 0,
          alignItems: "center",
        }}
      >
        <h1 style={{color: "lightgrey", margin: 0, textAlign: "center", flexGrow: 1 }}>
          SG Alftal
        </h1>
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
      <Divider orientation="left" style={{ borderColor: "grey" }}></Divider>
      <div style={{ marginBottom: "30px" }}></div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Table
          bordered={true}
          scroll={{ y:9999999 }} // Set the height of the table to 400px
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 999,
            position: []
          }}
          
        />
      </div>
    </>
  );
}

export default User;
