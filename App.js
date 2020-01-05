import React from 'react'
import * as Font from 'expo-font'

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { fromRight } from 'react-navigation-transitions'

import Login from './pages/Login'
import ReadQR from './pages/ReadQR'
import ShowQR from './pages/ShowQR'

/* LOGIN -> READER -> SHOW QR */

const RootStack = createStackNavigator(
	{
		Login: Login,
		ShowQR: ShowQR,
		ReadQR: ReadQR
	},
	{
		initialRouteName: 'Login',
		defaultNavigationOptions: {
			headerTransparent: true
		},
		transitionConfig: () => fromRight(500)
	}
)

const AppContainer = createAppContainer(RootStack)

export default class App extends React.Component {
	state = {
		fontLoaded: false
	}

	async componentDidMount() {
		await Font.loadAsync({
			'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf')
		})
		this.setState({ fontLoaded: true })
	}
	render() {
		return this.state.fontLoaded ? <AppContainer /> : null
	}
}
