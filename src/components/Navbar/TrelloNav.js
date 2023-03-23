import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Color from 'color';
import React from 'react';
import { connect, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';


import { logoutUser } from "../../actions";

const MainNav = styled.div`
    /*background: ${(props) => props.color || 'rgba(2, 106, 167, 1)'};*/
    margin: auto;
    width: 100%;
    padding: 4px;
    display: flex;
    justify-content: space-between;
    position: relative;
    background-color: #505050;
`;

const Logo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    right: 50%;
`;

const Img = styled.img`
    opacity: 0.5;
    width: 6rem;
    height: 2rem;
    :hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

const Buttons = styled.div`
    justify-content: flex-end;
    display: inline-flex;
    align-items: center;
`;

const SignButton = styled.div`
    border-radius: .3rem;
    background-color: rgba(0,0,0,0.16);
    color: white;
    padding: 0.4rem 0.6rem 0.4rem 0.6rem;
    background-color: #528bee;
    &:hover {
        background-color: #4848f0;
        cursor: pointer;
    }
    margin: 0 4px 0 4px;
`;



const TrelloNav = (props) => {
    const { isAuthenticated, isLoading } = props;
    const { backgroundColor } = props.theme;

    let newColor = '';
    if (backgroundColor) {
        newColor = Color(backgroundColor).darken(0.2).hsl().string();
    }

    const dispatch = useDispatch();
    const history = useHistory();

    const handleSignOut = () => {
        dispatch(logoutUser());
        history.push('/signin');
    }

    const isLoggedIn = (
        <SignButton onMouseDown={handleSignOut}>Cerrar sesión</SignButton>
    );
    const isLoggedOut = (
        <Buttons>
            <Link to="/signin" style={{ textDecoration: 'none' }}><SignButton>Iniciar sesión</SignButton></Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}><SignButton>Registrarse</SignButton></Link>
        </Buttons>
    );
    return (
      <MainNav color={newColor}>
        <Link to="/">
          <SignButton>
            <FontAwesomeIcon icon={faHome} size="lg" />
          </SignButton>
        </Link>
        <Link to="/">
          <Logo>
            
          </Logo>
        </Link>
        <Buttons>
          {!isLoading ? (isAuthenticated ? isLoggedIn : isLoggedOut) : null}
        </Buttons>
      </MainNav>
    );
}

const mapStateToProps = (state) => ({
    theme: state.theme,
})

export default connect(mapStateToProps, null)(TrelloNav);
