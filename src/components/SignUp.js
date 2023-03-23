import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import { connect, useDispatch } from "react-redux";
import { NavLink, Redirect } from 'react-router-dom';

import image from "../img/logo.jpeg";

import { registerUser } from "../actions/";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2rem',
        borderRadius: '1rem',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#026aa7'
    },
}));

const SignUp = ({ auth, history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const [state, setState] = useState({
        displayName: '',
        password: '',
        toFrontpage: false,
    });

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        dispatch(registerUser(state.email, state.password, state.displayName, () => history.push("/")));
        //setState({ toFrontpage: true });
    };

    const redirect = (
        <Redirect to="/" />
    );

    const signUp = (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img style={{ width: 250 }} src={image} />

          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
          <form onSubmit={handleSignUp} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="displayName"
                  label="Nombre de usuario"
                  name="displayName"
                  autoComplete="nickname"
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={onChange}
                />
              </Grid>
            </Grid>
            <div
              style={{ marginTop: "10px", color: "red", textAlign: "center" }}
            >
              {auth.errorMessage}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Registrarse
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link variant="body2" to="/signin" component={NavLink}>
                  ¿Ya tienes una cuenta? Ingresa
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );

    if (state.toFrontpage) {
        return redirect;
    } else {
        return signUp;
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(SignUp);