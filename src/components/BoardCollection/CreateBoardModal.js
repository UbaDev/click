import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { myFirebase } from "../../firebase/firebase";
import { createBoard, loadUserBoards } from '../../actions/';

const styles = theme => ({
    alignItemsAndJustifyContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

class CreateBoardModal extends Component {
    state = {
        open: false,
        title: '',
    };

    toggleOpen = () => {
        this.setState({
            open: !this.state.open,
        });
    };

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        // Attempt to register
        this.props.createBoard(this.state.title);
        this.props.loadUserBoards();
        this.toggleOpen();
    };


    render() {

        const classes = this.props;

        let user = myFirebase.auth().currentUser;
        
        return (
          <Fragment>
            {user.email === "admin@gmail.com" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={this.toggleOpen}
              >
                Crear nueva asignacion
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled
                color="primary"
                onClick={this.toggleOpen}
              >
                Crear nueva asignacion
              </Button>
            )}

            <Dialog open={this.state.open} onClose={this.toggleOpen}>
              <DialogTitle>Crear asignación</DialogTitle>
              <form action="/" method="POST" onSubmit={this.onSubmit}>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Titulo de la asignación"
                    type="text"
                    required={true}
                    fullWidth
                    onChange={this.onChange}
                  />
                </DialogContent>
                <DialogActions className={classes.alignItemsAndJustifyContent}>
                  <Button type="submit" color="primary">
                    Crear
                  </Button>
                  <IconButton color="primary" onClick={this.toggleOpen}>
                    <CloseIcon />
                  </IconButton>
                </DialogActions>
              </form>
            </Dialog>
          </Fragment>
        );
    }
}


export default connect(null, { createBoard, loadUserBoards })(withStyles(styles)(CreateBoardModal));
