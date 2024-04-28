import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Col, Divider, Row } from 'antd';
import { Input } from "antd";


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

const serverIP = "localhost" //""192.168.178.160"

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


function Admin() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [selectedRow, setSelectedRow] = useState<DataType | undefined>(
    undefined
  );
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [bierCnt, setBierCnt] = useState(0);
  const [softDrinkCnt, setSoftDrinkCnt] = useState(0);
  const [sonstigesCnt, setSonstigesCnt] = useState(0);



  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // const rowKey = selectedRowKeys[0];
      setBierCnt(0);
      setSoftDrinkCnt(0);
      setSonstigesCnt(0);
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
          console.log(res.data);
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
          padding: "20px",
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
          pagination={{ pageSize: 40 }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}></div>
      <div style={{ justifyContent: "center", display: "flex", paddingBottom: 20 }}>
        <Card title={selectedRow?.vorname ? selectedRow?.vorname + " " + selectedRow?.nachname : "Edit Row"} bordered={true} style={{ width: "75%", borderColor: "black" }}>
          <Divider orientation="left" style={{ borderColor: 'grey' }}>Bier</Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                placeholder="Bier"
                size="middle"
                onChange={(e) => { }}
                style={{
                  backgroundColor: "white",
                  width: 50,
                  borderColor: "#1c1c1c",
                  borderRadius: "6px",
                  color: "black",
                }}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
              onClick={() => {
                setBierCnt(bierCnt+1);
              }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                +
              </Button>
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
              onClick={() => {
                setBierCnt(bierCnt-1);
              }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                -
              </Button>
            </Col>
          </Row>
          <Divider orientation="left" style={{ borderColor: 'grey' }}>Softdrinks</Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                placeholder="Softdrinks"
                size="middle"
                onChange={(e) => { }}
                style={{
                  backgroundColor: "white",
                  width: 50,
                  borderColor: "#1c1c1c",
                  borderRadius: "6px",
                  color: "black",
                }}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
              onClick={() => {
                setBierCnt(bierCnt+1);
              }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                +
              </Button>
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
              onClick={() => {
                setBierCnt(bierCnt-1);
              }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                -
              </Button>
            </Col>
          </Row>
          <Divider orientation="left" style={{ borderColor: 'grey' }}>Sonstige Kosten</Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                placeholder="Sonst. Kosten"
                size="middle"
                onChange={(e) => { }}
                style={{
                  backgroundColor: "white",
                  width: 120,
                  borderColor: "#1c1c1c",
                  borderRadius: "6px",
                  color: "black",
                }}
              />
            </Col>
          </Row>
          <Divider orientation="left" style={{ borderColor: 'grey' }}></Divider>
          <Row justify="end">
            <Button
              style={{
                backgroundColor: "#4285f4",
                borderColor: "#4285f4",
                color: "white",
                marginRight: "20px",
              }}
            >
              Anwenden
            </Button>
          </Row>
        </Card>
      </div>
    </>
  );
}
export default Admin;
