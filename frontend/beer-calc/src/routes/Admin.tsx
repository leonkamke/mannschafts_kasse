import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Col, Divider, Row, ConfigProvider, Popconfirm, Modal } from "antd";
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
  const [sonstigesEntry, setSonstigesEntry] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // const rowKey = selectedRowKeys[0];
      setBierCnt(0);
      setSoftDrinkCnt(0);
      setSonstigesEntry("");
      const selectedRow: DataType = selectedRows[0];
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

  function onAnwenden(authHeader: any, updatedRow: any) {
    if (updatedRow) {
      try {
        axios
          .post("http://" + serverIP + ":3000/api/anwenden", updatedRow, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setTableData(res.data);
            }
          })
          .catch((error) => {
            // console.log("Error occurred:", error);
            // setErrorMessage("Du hast verkackt, du Idiot!");
          });
      } catch (error) {}
    }
    return undefined;
  }

  function onAllesAbrechnen(authHeader: any, updatedRow: any) {
    if (updatedRow) {
      try {
        axios
          .post("http://" + serverIP + ":3000/api/abrechnen", updatedRow, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              // Seite aktualisieren
              setTableData(res.data);
            }
          })
          .catch((error) => {
            // console.log("Error occurred:", error);
            // setErrorMessage("Du hast verkackt, du Idiot!");
          });
      } catch (error) {}
    }
  }

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
        <h1 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>
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
          pagination={{ position: [] }}
          style={{ width: "70%" }}
          scroll={{ y: 400 }} // Set the height of the table to 400px
          columns={columns}
          dataSource={tableData}
        />
      </div>
      <div style={{ marginBottom: "20px" }}></div>
      <div
        style={{ justifyContent: "center", display: "flex", paddingBottom: 20 }}
      >
        <Card
          title={
            selectedRow?.vorname
              ? selectedRow?.vorname + " " + selectedRow?.nachname
              : "Edit Row"
          }
          bordered={true}
          style={{ width: "75%", borderColor: "black" }}
        >
          <Divider orientation="left" style={{ borderColor: "grey" }}>
            Bier
          </Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                disabled={selectedRow === undefined}
                placeholder="Bier"
                value={bierCnt}
                size="middle"
                onChange={(e) => {}}
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
                  setBierCnt(bierCnt - 1);
                }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
                disabled={selectedRow === undefined}
              >
                -
              </Button>
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
                onClick={() => {
                  setBierCnt(bierCnt + 1);
                }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
                disabled={selectedRow === undefined}
              >
                +
              </Button>
            </Col>
          </Row>
          <Divider orientation="left" style={{ borderColor: "grey" }}>
            Softdrinks
          </Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                disabled={selectedRow === undefined}
                value={softDrinkCnt}
                placeholder="Softdrinks"
                size="middle"
                onChange={(e) => {}}
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
                  setSoftDrinkCnt(softDrinkCnt - 1);
                }}
                disabled={selectedRow === undefined}
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
            <Col className="gutter-row" span={6}>
              <Button
                disabled={selectedRow === undefined}
                onClick={() => {
                  setSoftDrinkCnt(softDrinkCnt + 1);
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
          </Row>
          <Divider orientation="left" style={{ borderColor: "grey" }}>
            Sonstige Kosten
          </Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                disabled={selectedRow === undefined}
                placeholder="Sonst. Kosten"
                size="middle"
                value={sonstigesEntry}
                onChange={(e) => {
                  setSonstigesEntry(e.target.value);
                }}
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
          <Divider orientation="left" style={{ borderColor: "grey" }}></Divider>
          <Row justify="end">
            <Col style={{ textAlign: "right" }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={selectedRow === undefined}
                style={{
                  backgroundColor: "#d43737",
                  borderColor: "#d43737",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                Alles abrechnen
              </Button>
              <Modal
                title="Alles Abrechnen"
                open={isModalOpen}
                onOk={() => {
                  if (selectedRow) {
                    onAllesAbrechnen(authHeader, { key: selectedRow.key });
                  }
                  setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
                okText="Ja"
                cancelText="Nein"
              >
                Sicher, dass {selectedRow?.vorname} {selectedRow?.nachname}{" "}
                alles bezahlt hat?
              </Modal>
              <div style={{ marginTop: 10 }} />
              <Button
                disabled={selectedRow === undefined}
                onClick={async () => {
                  if (selectedRow && !isNaN(Number(sonstigesEntry))) {
                    const updatedRow = {
                      key: selectedRow.key,
                      bier: bierCnt,
                      softdrinks: softDrinkCnt,
                      sonstige_kosten: Number(sonstigesEntry),
                    };
                    console.log("xxxxxxxx");
                    const result = await onAnwenden(authHeader, updatedRow);
                    console.log(result);
                  } else {
                  }
                }}
                style={{
                  backgroundColor: "#4285f4",
                  borderColor: "#4285f4",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                Anwenden
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default Admin;
