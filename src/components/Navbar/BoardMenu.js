import { faAngleLeft, faEllipsisH, faPaintBrush, faSearch, faStickyNote, faTasks, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import { connect, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage"; 

import TextAreaAutosize from "react-textarea-autosize";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { NavLink, Redirect } from "react-router-dom";

import { myFirebase, stor} from "../../firebase/firebase";
import Button from "@material-ui/core/Button";

import { changeBackground, getPhotosList } from '../../actions/';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "2rem",
    borderRadius: "1rem",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#026aa7",
  },
}));

const BackgroundMenu = styled.div`
    display: inline-block;
    overflow-x: hidden;

    width: 340px;
    height: 90%;
    background-color: whitesmoke;
    z-index: 1000;
    transform: ${(props) => props.changeBackground ? 'translateX(0)' : `translateX(100%)`};
    transition: transform 0.3s ease;
    position: absolute;
`;

const PhotoMenu = styled.div`
    display: inline-block;
    overflow-x: hidden;

    width: 340px;
    height: 90%;
    background-color: whitesmoke;
    z-index: 1000;
    transform: ${(props) => props.changePhoto ? 'translateX(0)' : `translateX(100%)`};
    transition: transform 0.3s ease;
    position: absolute;
`;

const BackgroundTile = styled.div`
    background-color: ${(props) => props.color || 'blue'};
    height: 10%;
    width: 40%;
    margin: .5rem;
    margin-top: 1rem;
    border-radius: .8rem;
    display: inline-block;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const PhotoTile = styled.div`
    background-image: ${(props) => `url(` + props.url + `)` || ''};
    background-size: contain;
    background-size: cover;
    height: 10%;
    width: 40%;
    margin: .5rem;
    margin-top: 1rem;
    border-radius: .8rem;
    display: inline-block;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const BackgroundColorMenu = styled.div`
    display: inline-block;
    overflow-x: hidden;

    width: 340px;
    height: 90%;
    background-color: whitesmoke;
    z-index: 1001;
    transform: ${(props) => props.changeBackgroundColor ? 'translateX(0)' : `translateX(100%)`};
    transition: transform 0.3s ease;
    position: absolute;
`;

const MenuWrapper = styled.div`
    z-index: 999;
    overflow-x: hidden;
    width: 740px;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: whitesmoke;
    transform: ${(props) => props.showBoardMenu ? 'translateX(0)' : `translateX(100%)`};
    transition: transform 0.3s ease;
    display: block;
    height: 100%;
`;

const Menu = styled.div`
    box-sizing: border-box;
    width: 740px;
    padding: 0px 12px;
    color: #172b4d;
`;

const MenuItems = styled.div`
    border-bottom: 1px solid #ccd2d7;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 1.2rem;

    font-weight: 500;
    color: #193345;
    text-align: center;
`;

const MenuArrow = styled.button`
    border: none;
    font-size: 1.5rem;
    background: none;
    color: #42526e;
    font-weight: bold;

    position: absolute;
    top: 16px;
    transition: .25s all;
    left: 2rem;

    &:hover {
        color: #193345;
        cursor: pointer;
    }
`;

const CloseMenu = styled.button`
    border: none;
    font-size: 1.5rem;
    background: none;
    color: #42526e;
    position: absolute;
    top: 18px;
    right: 12px;

    &:hover {
        color: #193345;
        cursor: pointer;
    }
`;

const OptionsList = styled.ul`
    text-align: left;
    list-style: none;
    cursor: pointer;
    padding-inline-end: 40px;
`;

const OptionsItem = styled.li`
    display: flex;
    align-items: center;
    color: #193345;
    font-size: 1rem;
    padding: .4rem .4rem;
    line-height: 1.2rem;
    border-radius: 3px;
    font-weight: 600;
    &:hover {
        background-color: #6b808c3f;
    }
`;

const Icon = styled.div`
    color: #193345;
    padding: .3rem;
    margin-right: .3rem;
`;

const SearchIcon = styled.span`
    position: absolute;
    left: 10px;
    top: 15px;
    color: #42526e;
`;

const SearchPhotos = styled.input`
    box-sizing: border-box;
    width: 316px;
    background-color: #fafbfc;
    display: block;
    color: #172b4d;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    margin: 8px 0px;
    padding: 0.6rem 2rem;
    border: none;
    font-size: 14px;
    transition-property: background-color, border-color, box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;

    &:focus{
        box-shadow: inset 0 0 0 2px rgb(0, 121, 191);
        background-color: #FFFFFF;
    }
`;


function BoardMenu(props) {
  const classes = useStyles();
  // Background states
  const [changeBackground, setChangeBackground] = useState(false);
  const [changePhoto, setChangePhoto] = useState(false);
  const [changeBackgroundColor, setChangeBackgroundColor] = useState(false);

  // redux state
  const { photosList } = props.theme;

  // passed props
  const { showBoardMenu, toggleMenu } = props;

  const colorsList = [
    "rgb(0, 121, 191)",
    "rgb(210, 144, 52)",
    "rgb(81, 152, 57)",
    "rgb(176, 70, 50)",
    "rgb(137, 96, 158)",
    "rgb(205, 90, 145)",
    "rgb(75, 191, 107)",
    "rgb(0, 174, 204)",
  ];

  // hide/show the menu section where you pick either background or photo
  const toggleBackground = () => {
    if (changeBackgroundColor && changeBackground) {
      setChangeBackgroundColor(!changeBackgroundColor);
    } else if (changePhoto && changeBackground) {
      setChangePhoto(!changePhoto);
    } else {
      setChangeBackground(!changeBackground);
    }
  };

  let nombre = myFirebase.auth().currentUser.displayName;
  let correo = myFirebase.auth().currentUser.email;

  const [details, setDetails] = useState({
    nombre: "",
    correo: "",
    fecha: "",
    asignacion: "",
    actividades: "",
    horas: "",
    minutos: "",
    comentarios: "",
    minutosNotrabajados: "",
    file: "",
  });

    const [image, setImage] = useState("");
    const [Url, setUrl] = useState("");



 
  const PostData = async (e) => {

      
    alert("Se han registrado las metricas correctamente");

    const {
      fecha,
      asi,
      asignacion,
      actividades,
      horas,
      minutos,
      comentarios,
      minutosNotrabajados,
      file,
    } = details;



    const res = await fetch(
      "https://click-manager-default-rtdb.firebaseio.com/metricas.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          nombre,
          fecha,
          asi,
          asignacion,
          actividades,
          horas,
          minutos,
          comentarios,
          minutosNotrabajados,
          file,
        }),
      }
    );

        if (image == null) return;
        setUrl("Getting Download Link...");

        // Sending File to Firebase Storage
        stor
          .ref(`/images/${image.name}`)
          .put(image)
          .on("state_changed", alert("success"), alert, () => {
            // Getting Download Link
            stor
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                setUrl(url);
              });
          });

    
  }; // State to store uploaded file






  return (
    <MenuWrapper showBoardMenu={showBoardMenu}>
      <Menu>
        <MenuItems>
          {changeBackground ? (
            <Title>Change Background</Title>
          ) : (
            <Title>Registro de métricas</Title>
          )}
          {changeBackground ? (
            <MenuArrow onClick={toggleBackground}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </MenuArrow>
          ) : null}
          <CloseMenu onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseMenu>
        </MenuItems>
        <MenuItems>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="date"
                  id="fecha"
                  label="Fecha de métrica"
                  name="fecha"
                  onChange={(e) => {
                    setDetails({ ...details, fecha: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="asi"
                  label="Asignación"
                  name="asi"
                  onChange={(e) => {
                    setDetails({ ...details, asignacion: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="act"
                  label="Actividades realizadas"
                  name="act"
                  onChange={(e) => {
                    setDetails({ ...details, actividades: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="number"
                  id="horas"
                  label="Horas trabajadas"
                  name="horas"
                  onChange={(e) => {
                    setDetails({ ...details, horas: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                  id="min"
                  label="Minutos trabajados"
                  name="min"
                  onChange={(e) => {
                    setDetails({ ...details, minutos: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                  id="minn"
                  label="Minutos no trabajados"
                  name="minn"
                  onChange={(e) => {
                    setDetails({
                      ...details,
                      minutosNotrabajados: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="c"
                  label="Comentarios"
                  name="c"
                  onChange={(e) => {
                    setDetails({ ...details, comentarios: e.target.value });
                  }}
                />
              </Grid>

            </Grid>
            <div
              style={{ marginTop: "10px", color: "red", textAlign: "center" }}
            ></div>
            <Button
              onClick={PostData}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Registrar metricas
            </Button>
          </form>
        </MenuItems>
      </Menu>
    </MenuWrapper>
  );
}

function Search() {
    const [searchTerm, setSearchTerm] = useState('forest');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // called every time searchTerm is changed 
    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            //gets executed after 700ms
            setLoading(false);
        }, 700)

        // delays delayDebounceFn from being executed by clearing timer
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, dispatch])

    return (
        <Fragment>
            <SearchPhotos
                placeholder='Photos'
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {
                loading && <Loader />
            }
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
});

export default connect(mapStateToProps, { changeBackground, getPhotosList })(BoardMenu);