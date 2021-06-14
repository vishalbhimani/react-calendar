import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Calender from './components/Calender';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { AppThemeProvider } from './components/widgets/AppThemeProvider';
import TopNav from './components/layout/TopNav';
import AppProvider from './context/AppProvider';
import MongoContext from './MongoContext';
import * as Realm from 'realm-web';

const theme: Theme = createMuiTheme({
	palette: {
		primary: {
			main: '#1d2236'
		},
		secondary: {
			main: '#039ae5'
		}
	}
});

export default function App() {
	const [client, setClient] = useState<object | null>(null)
	const [user, setUser] = useState<object | null>(null)
	const [app, setApp] = useState(new Realm.App({id: process.env.REACT_APP_REALM_APP_ID || ''}))

	useEffect(() => {
		async function init () {
		  if (!user) 
			setUser(app.currentUser ? app.currentUser : await app.logIn(Realm.Credentials.anonymous()))
		  
		  if (!client) 
			setClient(app.currentUser ? app.currentUser.mongoClient('mongodb-atlas') : null)
		}
	
		init();
	}, [app, client, user])

	return (
		<MongoContext.Provider value={{app, client, user, setClient, setUser, setApp}}>
			<AppThemeProvider theme={theme}>
				<AppProvider>
					<Router>
						<AppContainer>
							<TopNav />
							<MainContainer>
								<Switch>
									<Route exact path='/' component={Calender} />
									<Route render={() => <h1>Oh man! You've lost your path...</h1>} />
								</Switch>
							</MainContainer>
						</AppContainer>
					</Router>
				</AppProvider>
			</AppThemeProvider>
		</MongoContext.Provider>
	);
}

const MainContainer = styled.main`
	padding: 16px;
`;
const AppContainer = styled.div`
	display: grid;
	grid-template-rows: 64px calc(100vh - 64px);
`;
