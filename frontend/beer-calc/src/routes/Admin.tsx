import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Divider, Radio, Table } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";

interface DataType {
  key: React.Key;
  vorname: string;
  nachname: string;
  offene_kosten: number;
  sonstige_kosten: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Vorname",
    dataIndex: "vorname",
  },
  {
    title: "Nachname",
    dataIndex: "nachname",
  },
  {
    title: "Offene Kosten",
    dataIndex: "offene_kosten",
  },
  {
    title: "Sonstige Kosten",
    dataIndex: "sonstige_kosten",
  },
];

const data: DataType[] = [
  {
    key: "1",
    vorname: "David",
    nachname: "Nilles",
    offene_kosten: 30,
    sonstige_kosten: 20,
  },
  {
    key: "2",
    vorname: "Leon",
    nachname: "Kamke",
    offene_kosten: 10,
    sonstige_kosten: 5,
  },
  {
    key: "3",
    vorname: "Richard",
    nachname: "Seibel",
    offene_kosten: 34,
    sonstige_kosten: 888,
  },
  {
    key: "4",
    vorname: "Max",
    nachname: "Mustermann",
    offene_kosten: 0,
    sonstige_kosten: 34,
  },
];

// rowSelection object indicates the need for row selection

function Admin() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [selectedRow, setSelectedRow] = useState<DataType | undefined>(
    undefined
  );

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const rowKey = selectedRowKeys[0];
      const selectedRow: DataType = selectedRows[0];
      console.log(selectedRow);
      setSelectedRow(selectedRow);
    },
  };

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
          borderColor: "black",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>Admin</h1>
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
          columns={columns}
          dataSource={data}
        />
      </div>
    </>
  );
}
export default Admin;
