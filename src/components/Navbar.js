import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const NavigationBar = ({ isAuthenticated, userRole, onLogout }) => {
  return (
    <Navbar style={{ 
      backgroundColor: '#2a3f54',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #40566b'
    }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" style={styles.brand}>
          Abubakar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={styles.navLink}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" style={styles.navLink}>
              Dashboard
            </Nav.Link>
            {isAuthenticated && userRole === 'creator' && (
              <Button
                as={Link}
                to="/creator"
                style={styles.createButton}
              >
                Create Content
              </Button>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" style={styles.navLink}>
                  Sign In
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  style={styles.joinButton}
                >
                  Join Now
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-light" 
                onClick={onLogout}
                style={styles.signOutButton}
              >
                Sign Out
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const styles = {
  brand: {
    color: '#e8f4fc',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  navLink: {
    color: '#cbd5e0',
    padding: '8px 15px',
    margin: '0 5px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#40566b'
    }
  },
  createButton: {
    backgroundColor: '#4e7cff',
    borderColor: '#4e7cff',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '8px 20px',
    fontWeight: '500',
    marginLeft: '10px',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    letterSpacing: '0.5px'
  },
  joinButton: {
    backgroundColor: '#4e7cff',
    color: '#ffffff',
    padding: '8px 15px',
    margin: '0 5px',
    borderRadius: '4px',
    fontWeight: '500',
    border: 'none'
  },
  signOutButton: {
    borderRadius: '6px',
    padding: '8px 20px',
    borderColor: '#cbd5e0',
    color: '#cbd5e0',
    fontWeight: '500'
  }
};

export default NavigationBar;