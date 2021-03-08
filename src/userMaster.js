import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container, Button, Form, Table, Modal, FormControl, InputGroup } from 'react-bootstrap';
import styles from './usermaster.css';
import './common.css';
import { FaPencilAlt, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UserMaster = (props) => {

  const [search, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [editshow, setEditShow] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [masterTable, setmasterTable] = useState({
    id: '',
    userName: '',
    userId: '',
    password: '',
    userRole: '',
  });
  const [userList, setUserList] = useState([]);
  const [editUserList, setEditUserList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editChange, setEditChange] = useState({
    newpassword: '',
    newUserRole: '',
  });
  const handleClose = () => setShow(false);
  const handleEditClose = () => setEditShow(false);
  const handleShow = () => setShow(true);
  const handleEditShow = () => setEditShow(true);

  

  const options = {
    // onOpen: props => console.log(props.foo),
    // onClose: props => console.log(props.foo),
    autoClose: 2000,
    draggable: true,
    hideProgressBar: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    closeOnClick: true
  };

  let i = 1;
  function sno() { return i++; }

  useEffect(() => {
    Axios.get("/user-master", {
      headers: {
        "x-access-token": localStorage.getItem(`login`),
      }
    }).then((response) => {
      let result = response.data.recordset;
      setUserList(result);
    });
  }, [refreshKey]);

  const handleMasterChange = (e) => setmasterTable({
    ...masterTable,
    [e.target.name]: [e.target.value],
  });

  const handleSubmit = (e) => {
    if ((masterTable.userName != "") && (masterTable.userId != "") && (masterTable.password != "") && (masterTable.userRole != "")) {
      e.preventDefault();
      Axios.post("/user-master",
        {
          userName: masterTable.userName, userId: masterTable.userId,
          password: masterTable.password, userRole: masterTable.userRole
        }, {
        headers: {
          "x-access-token": localStorage.getItem(`login`),
        }
      })
        .then(
          (response) => {
            if (response.data.status == true) {
              handleClose();
              setRefreshKey(oldKey => oldKey + 1);
              toast.success(`New user ${masterTable.userName} added.`, options);
            }
            else if (response.data.status == false) {
              handleClose();
              toast.info(`${response.data.message}`, options);
            }
          });
    }
    else {
      toast.info("Empty value are not valid please Enter Valid  Details");
    }

  };

  const handleEditValue = (event) => setEditChange({
    ...editChange,
    [event.target.name]: [event.target.value],
  });

  const handleEditSubmit = () => {
    if ((editChange.password != "") && (editChange.userRole != "")) {
      const id = editUserLits.id;
      Axios.patch(`/user-master/${id}`,
        { id: id, newpassword: editChange.newpassword, newUserRole: editChange.userRole }, {
        headers: {
          "x-access-token": localStorage.getItem(`login`)
        }
      })
        .then((response) => {
          if (response.status === 200) {
            handleEditClose();
            setRefreshKey(oldKey => oldKey + 1);
            toast.success(`New updated successfully.`, options);
          }
        });
    }
    else {
      toast.info("Please update password or UserRole")
    }
  }

  const handleEdit = (id) => {
    const editUserDataRow = userLits.find(item => item.id === id);
    setEditUserList(editUserDataRow);
    handleEditShow();
  };

  const handleDelete = (id) => {
    Axios.delete(`/user-master/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem(`login`),
      }
    }).then((response) => {
      if (response.status == 200) {
        setRefreshKey(oldKey => oldKey + 1);
        toast.info(`User deleted.`, options);
      }
    });
  }

  return (
    <div className="wrapper">
      <Container>
        <ToastContainer
          newestOnTop={false}
          rtl={false}
        />

        <Row><Col className="mt-5 mb-2"><h1 className="main_title">User Master</h1></Col></Row>

        <Row className="mb-2">
          <Col md={2} xs={12} sm={2} lg={2}>
            <Button variant="primary" onClick={handleShow}><FaPlus id="custom_icon" />New user</Button>
          </Col>

          <Col md={4} xs={12} sm={2} lg={6}>
            <div className="mb-3">
              <Form id="search-form">
                <InputGroup id="search-form-user-master">
                  <FormControl
                    placeholder="Search Your Keyword"
                    aria-label="Search Your Keyword"
                    aria-describedby="basic-addon2"
                    onChange={event => {setSearchTerm(event.target.value)}}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" id="search-button">
                      <FaSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>

        <Table style={{ width: '70%' }}>
          <thead style={{ background: '#8b8498' }}>
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>User ID</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userLits?.filter((val) => {
              if(search == "") {
                return val
              } else if(val.user_name.toLowerCase().includes(search.toLowerCase())){
                return val
              }
            }).map((value) => {
              return <tr key={value.id}>
                <td>{sno()}</td>
                <td>{value.user_name}</td>
                <td>{value.email}</td>
                <td>{value.user_role}</td>
                <td>
                  <FaPencilAlt onClick={() => handleEdit(value.id)} id="master_user_edit" />
                  <FaTrashAlt id="master_user_delete" onClick={() => handleDelete(value.id)} />
                </td>
              </tr>;
            })}
          </tbody>
        </Table>

        {/* Add New user to master table STARTS */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>User Master</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">User Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="userName"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3"> User Id</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="email"
                    name="userId"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">Password</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      required
                      aria-label="Password"
                      aria-describedby="basic-addon2"
                      onChange={handleMasterChange}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglePasswordVisiblity}><FaEye id="pwd-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="ControlSelect1">
                <Form.Label column sm="3">Role</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    defaultValue="Choose..."
                    name="userRole"
                    onChange={handleMasterChange}
                  >
                    <option>Choose...</option>
                    <option>Chief Executive</option>
                    <option>Admin</option>
                    <option>User</option>
                    <option>Accountant</option>
                    <option>Site Supervisor	</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary" onClick={handleClose} id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary" onClick={handleSubmit} id="modal-submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Add New user to master table ENDS */}

        {/* Add Edit user to master table ENDS */}
        <Modal show={editshow} onHide={handleEditClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>Edit user master - {editUserList.user_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">User Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="userName"
                    value={editUserList.user_name}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3"> User Id</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="email"
                    name="userId"
                    value={editUserList.email}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">New Password</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type={passwordShown ? "text" : "password"}
                      name="newpassword"
                      required
                      aria-label="Password"
                      aria-describedby="basic-addon2"
                      onChange={handleEditValue}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglePasswordVisiblity}><FaEye id="pwd-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="ControlSelect1">
                <Form.Label column sm="3">Role</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    defaultValue={editUserList.user_role}
                    name="userRole"
                    onChange={handleEditValue}
                  >
                    <option>Chief Executive</option>
                    <option>Admin</option>
                    <option>User</option>
                    <option>Accountant</option>
                    <option>Site Supervisor	</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary"
                  onClick={handleEditClose}
                  id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary"
                  onClick={handleEditSubmit}
                  id="modal-submit">
                  Update
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Add Edit user to master table ENDS */}

      </Container>
    </div>
  );
};
UserMaster.propTypes = {};

UserMaster.defaultProps = {};

export default UserMaster;