import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card } from "antd";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Col, Divider, Row, ConfigProvider, Popconfirm, Modal } from "antd";
import { Input, message } from "antd";

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

const historyColumns: TableColumnsType<DataType> = [
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
    title: "Typ",
    dataIndex: "type",
    width: 100,
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
    title: "Sonstige Kosten",
    dataIndex: "sonstige_kosten",
    width: 120,
    render: (text) => <span>{text} €</span>,
  },
  {
    title: "Datum",
    dataIndex: "timestamp",
    width: 120,
  },
];

function Admin() {
  const navigate = useNavigate();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [selectedRows, setSelectedRows] = useState<DataType[] | undefined>(
    undefined
  );
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [historyData, setHistoryData] = useState<DataType[]>([]);
  const [bierCnt, setBierCnt] = useState(0);
  const [softDrinkCnt, setSoftDrinkCnt] = useState(0);
  const [sonstigesEntry, setSonstigesEntry] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isdeleteUserOpen, setisdeleteUserOpen] = useState(false);
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [VornameLoeschen, VachnameLoeschen] = useState("");
  const [neuerVorname, setNeuerVorname] = useState("");
  const [neuerNachname, setNeuerNachname] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // const rowKey = selectedRowKeys[0];
      setBierCnt(0);
      setSoftDrinkCnt(0);
      setSonstigesEntry("");
      setSelectedRows(selectedRows);
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

  function onHistory(authHeader: any) {
    try {
      axios
        .get<DataType[]>("http://" + serverIP + ":3000/api/history", {
          headers: {
            Authorization: authHeader,
          },
        })
        .then((res) => {
          setHistoryData(res.data);
        });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

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

  function neuerSpieler(
    authHeader: any,
    neuerVorname: string,
    neuerNachname: string
  ) {
    if (neuerVorname && neuerNachname) {
      try {
        axios
          .post(
            "http://" + serverIP + ":3000/api/neuer_spieler",
            { neuerVorname: neuerVorname, neuerNachname: neuerNachname },
            {
              headers: {
                Authorization: authHeader,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              setTableData(res.data);
            }
          })
          .catch((error) => {});
      } catch (error) {}
    }
    return undefined;
  }

  function onAllesAbrechnen(authHeader: any, updatedRows: any) {
    if (updatedRows) {
      try {
        axios
          .post("http://" + serverIP + ":3000/api/abrechnen", updatedRows, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              // Seite aktualisieren
              setTableData(res.data);
              setCreateUserOpen(false);
            }
          })
          .catch((error) => {
            // console.log("Error occurred:", error);
            // setErrorMessage("Du hast verkackt, du Idiot!");
          });
      } catch (error) {}
    }
  }

  function onSpielerLoeschen(authHeader: any, updatedRow: any) {
    if (updatedRow) {
      try {
        axios
          .post(
            "http://" + serverIP + ":3000/api/spielerloeschen",
            updatedRow,
            {
              headers: {
                Authorization: authHeader,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              // Seite aktualisieren
              setTableData(res.data);
              setCreateUserOpen(false);
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
      {contextHolder}
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
          rowSelection={{
            ...rowSelection,
          }}
          style={{}}
          bordered={true}
          scroll={{ y: 400 }} // Set the height of the table to 400px
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 999,
            position: [],
          }}
        />
      </div>
      <div style={{ marginBottom: "18px" }}></div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button
          onClick={() => {
            setCreateUserOpen(true);
          }}
          style={{
            backgroundColor: "#4285f4",
            borderColor: "#4285f4",
            color: "white",
            marginRight: "20px",
          }}
        >
          Spieler hinzufügen
        </Button>
        <Modal
          title="Spieler hinzufügen"
          open={isCreateUserOpen}
          onOk={() => {
            // api request senden
            if (neuerVorname.length > 1 && neuerNachname.length > 1) {
              neuerSpieler(authHeader, neuerVorname, neuerNachname);
              setCreateUserOpen(false);
            }
          }}
          onCancel={() => setCreateUserOpen(false)}
          okText="Erstellen"
          cancelText="Abbrechen"
        >
          <div style={{ marginTop: 20 }} />
          <Input
            placeholder="Vorname"
            size="large"
            onChange={(e) => {
              setNeuerVorname(e.target.value);
            }}
          />
          <div style={{ marginTop: 15 }} />
          <Input
            placeholder="Nachname"
            size="large"
            onChange={(e) => {
              setNeuerNachname(e.target.value);
            }}
          />
        </Modal>

        <Button
          onClick={() => setisdeleteUserOpen(true)}
          disabled={selectedRows === undefined || selectedRows.length != 1}
          style={{
            backgroundColor: "#d43737",
            borderColor: "#d43737",
            color: "white",
            marginRight: "20px",
          }}
        >
          Spieler löschen
        </Button>
        <Modal
          title="Spieler löschen"
          open={isdeleteUserOpen}
          onOk={() => {
            if (selectedRows) {
              onSpielerLoeschen(authHeader, { key: selectedRows[0].key });
              setisdeleteUserOpen(false);
            }
          }}
          onCancel={() => setisdeleteUserOpen(false)}
          okText="Ja"
          cancelText="Nein"
        >
          Sicher, dass{" "}
          {selectedRows && selectedRows.length == 1
            ? selectedRows[0].vorname + " " + selectedRows[0].nachname
            : "der Spieler"}{" "}
          gelöscht werden soll?
        </Modal>
      </div>
      <div style={{ marginTop: "15px" }}>
        <Button
          onClick={() => {
            onHistory(authHeader);
            setHistoryOpen(true);
          }}
          style={{
            backgroundColor: "#1d1d1d",
            borderColor: "grey",
            color: "white",
            marginRight: "20px",
          }}
        >
          Historie
        </Button>
        <Modal
          title="Historie"
          open={isHistoryOpen}
          onCancel={() => setHistoryOpen(false)}
          footer={null}
          width={2000}
        >
          <Table
            bordered={true}
            scroll={{ y: 400 }} // Set the height of the table to 400px
            columns={historyColumns}
            dataSource={historyData}
            pagination={{
              pageSize: 999,
              position: [],
            }}
          />
        </Modal>
      </div>
      <Divider orientation="left" style={{ borderColor: "grey" }}></Divider>
      <div style={{ marginBottom: "30px" }}></div>

      <div
        style={{ justifyContent: "center", display: "flex", paddingBottom: 20 }}
      >
        <Card
          bordered={true}
          style={{ width: "100%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          <h2>{"Editor"}</h2>
          <Divider orientation="left" style={{ borderColor: "grey" }}>
            Bier
          </Divider>
          <Row gutter={10}>
            <Col className="gutter-row" span={6}>
              <Input
                disabled={selectedRows === undefined || selectedRows.length < 1}
                placeholder="Bier"
                value={bierCnt}
                size="middle"
                onChange={(e) => {}}
                style={{
                  width: 50,
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
                disabled={selectedRows === undefined || selectedRows.length < 1}
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
                disabled={selectedRows === undefined || selectedRows.length < 1}
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
                disabled={selectedRows === undefined || selectedRows.length < 1}
                value={softDrinkCnt}
                placeholder="Softdrinks"
                size="middle"
                onChange={(e) => {}}
                style={{
                  width: 50,
                }}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
                onClick={() => {
                  setSoftDrinkCnt(softDrinkCnt - 1);
                }}
                disabled={selectedRows === undefined || selectedRows.length < 1}
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
                disabled={selectedRows === undefined || selectedRows.length < 1}
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
                disabled={selectedRows === undefined || selectedRows.length < 1}
                placeholder="Sonst. Kosten"
                size="middle"
                value={sonstigesEntry}
                onChange={(e) => {
                  setSonstigesEntry(e.target.value);
                }}
                style={{
                  width: 120,
                }}
              />
            </Col>
          </Row>
          <Divider orientation="left" style={{ borderColor: "grey" }}></Divider>
          <Row justify="end">
            <Col style={{ textAlign: "right" }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={selectedRows === undefined || selectedRows.length < 1}
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
                  if (selectedRows && selectedRows.length > 0) {
                    onAllesAbrechnen(authHeader, {
                      keys: selectedRows.map((row) => row.key),
                      vornamen: selectedRows.map((row) => row.vorname),
                      nachnamen: selectedRows.map((row) => row.nachname),
                    });
                    setIsModalOpen(false);
                  }
                }}
                onCancel={() => setIsModalOpen(false)}
                okText="Ja"
                cancelText="Nein"
              >
                Sicher, dass alles bezahlt wurde?
              </Modal>
              <div style={{ marginTop: 10 }} />
              <Button
                disabled={selectedRows === undefined || selectedRows.length < 1}
                onClick={async () => {
                  if (selectedRows && !isNaN(Number(sonstigesEntry))) {
                    const updatedRow = {
                      keys: selectedRows.map((row) => row.key),
                      vornamen: selectedRows.map((row) => row.vorname),
                      nachnamen: selectedRows.map((row) => row.nachname),
                      bier: bierCnt,
                      softdrinks: softDrinkCnt,
                      sonstige_kosten: Number(sonstigesEntry),
                    };
                    await onAnwenden(authHeader, updatedRow);
                    messageApi.open({
                      type: "success",
                      content: "Erfolgreich eingetragen!",
                      style: {
                        paddingTop: 120,
                      },
                    });
                  } else {
                  }
                  setBierCnt(0);
                  setSoftDrinkCnt(0);
                  setSonstigesEntry("");
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
