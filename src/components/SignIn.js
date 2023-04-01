import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { NavLink, Redirect } from 'react-router-dom';


import image from "../img/logo.jpeg";

import { loginUser } from "../actions";

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
        width: 50,
        height: 50
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#026aa7'
    },
}));

export default function SignIn(props) {

  const [show, setShow] = React.useState(false);
    const classes = useStyles();

    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: '',
        password: '',
        toFrontpage: false,
    });

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        });
    };

    async function handleSignIn(e) {
        e.preventDefault();
        dispatch(loginUser(state.email, state.password, props.history));
        setState({ toFrontpage: true });
    };

    const redirect = (
        <Redirect to="/" />
    );

    const signIn = (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <img style={{ width: 250 }} src={image} />

          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSignIn} className={classes.form} >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
            />
            <FormControlLabel
              control={
                <Checkbox checked={true} value="remember" color="primary" />
              }
              label="Recordar contraseña"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" to="/signup" component={NavLink}>
                  {"¿No tienes una cuenta? Registrate"}
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
        return signIn;
    }
}