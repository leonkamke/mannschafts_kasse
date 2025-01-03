import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Divider, Button, TableColumnsType, Table } from "antd";

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

const serverIP = "mannschaftskasse.sg-alftal.de"; //"192.168.178.131";

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
    render: (text) => <span>{text} €</span>,
  },
  {
    title: "Sonstige Kosten",
    dataIndex: "sonstige_kosten",
    width: 120,
    render: (text) => <span>{text} €</span>,
  },
  {
    title: "Gesamtkosten",
    dataIndex: "gesamtkosten",
    width: 130,
    render: (text) => <span>{text} €</span>,
  },
];

function Spieler() {
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
        <h1
          style={{
            color: "lightgrey",
            margin: 0,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
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
          style={{}}
          bordered={true}
          scroll={{ y: 9999999 }} // Set the height of the table to 400px
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 999,
            position: [],
          }}
        />
      </div>
    </>
  );
}

export default Spieler;
