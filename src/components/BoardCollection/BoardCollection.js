import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React, { Component } from 'react'
import FadeIn from 'react-fade-in';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import styled from 'styled-components';
import firebase from "firebase";
import {ref, onValue} from "firebase/database";

import { myFirebase } from "../../firebase/firebase";
import image from "../../img/logo.jpeg";

import { loadUserBoards } from '../../actions/';
import { loadBoard } from '../../actions/board';
import BoardTile from './BoardTile';
import CreateBoardModal from './CreateBoardModal';

const Collection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 70vh;
`;

const Paper = styled.div`
    background: rgba(255,255,255,0.85);
    padding: 2rem;
    border-radius: 1rem;
`;

const Title = styled.div`
    position: center;
    padding: 5px;
    font-size: 16px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #172b4d;
`;


const Table = styled.div`
  border: 1px solid #528bee;
  width: 100%;
  border-radius: 10px;
`;

const Spacing = styled.div`
    margin: 5px;
`;

const Boards = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 600px;
    margin-bottom: 2rem;
    margin-top: 1rem;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

class BoardCollection extends Component {
  constructor(props) {
    super(props);
    this.handleClickBoard = this.handleClickBoard.bind(this);

    this.state = {
      data: null,
      loading: true,
    };
  }
  componentDidMount() {
    this.props.loadUserBoards();

    const dbRef = firebase.database().ref("/metricas");

    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();

      console.log(data)
      this.setState({ data: data, loading: false });
    });
  }

  handleClickBoard(e, boardId) {
    if (
      e.target.className instanceof SVGAnimatedString ||
      e.target.className.includes("inner")
    ) {
    } else {
      const { history } = this.props;
      this.props.loadBoard(boardId);
      history.push("/board/" + boardId);
    }
  }

  render() {

     const rows = [];

     for (const key in this.state.data) {
       rows.push(
         <tr key={key}>
           <td style={{ padding: 20 }}>{this.state.data[key].fecha}</td>
           <td>{this.state.data[key].nombre}</td>
           <td>{this.state.data[key].asignacion}</td>
           <td>{this.state.data[key].correo}</td>
           <td>{this.state.data[key].horas}</td>
           <td>{this.state.data[key].minutos}</td>
           <td>{this.state.data[key].minutosNotrabajados}</td>
           <td>{this.state.data[key].comentarios}</td>
         </tr>
       );
     }


    let user = myFirebase.auth().currentUser;
    return (
      <FadeIn>
        <Collection>
          <Paper>
            <Title>
              <img style={{ width: 100 }} src={image} />

              <p>Panel de asignaciones</p>
            </Title>
            <Boards>
              {this.props.boards.isLoading ? (
                <Loader />
              ) : (
                this.props.boards.boards.map((board, index) => (
                  <Spacing key={board.boardId}>
                    <BoardTile
                      onClick={(e) => this.handleClickBoard(e, board.boardId)}
                      index={index}
                      title={board.title}
                      key={board.boardId}
                      boardId={board.boardId}
                    />
                  </Spacing>
                ))
              )}
            </Boards>
            <Spacing />
            <CreateBoardModal />
          </Paper>

          {user.email === "admin@gmail.com" ? (
            <div className="container">
              <h3 style={{ marginBottom: 30, marginTop: 30, fontSize: 30 }}>
                Métricas de los empleados
              </h3>
              <Table>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#528bee",
                      color: "#fff",
                      fontSize: 16,
                    }}
                  >
                    <th style={{ padding: 20 }}>Fecha</th>
                    <th>Nombre</th>
                    <th>Asignación</th>
                    <th>Correo</th>
                    <th>Horas</th>
                    <th style={{ padding: 30 }}>Min T</th>
                    <th>Min no</th>
                    <th>Comentarios</th>
                  </tr>
                </thead>

                <tbody style={{ padding: 20 }}>{rows}</tbody>
              </Table>
            </div>
          ) : (
            <></>
          )}
        </Collection>
      </FadeIn>
    );
  }
}

const mapStateToProps = state => ({
    boards: state.boards
});

export default connect(mapStateToProps, { loadUserBoards, loadBoard })(BoardCollection);
