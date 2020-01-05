import React from 'react'

import {
	StyleSheet,
	View,
	StatusBar,
	KeyboardAvoidingView,
	ClippingRectangle
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { primaryGradientArray } from '../utils/Colors'
import { serverIP } from '../utils/Config'

import Header from '../components/Header.js'
import InputText from '../components/InputText.js'
import InputPassword from '../components/InputPassword.js'
import InputDID from '../components/InputDID.js'
import InputMID from '../components/InputMID.js'
import MyButton from '../components/MyButton.js'

class Login extends React.Component {
	state = {
		username: '',
		password: '',
		DID: '',
		masterSecretID: ''
	}

	static navigationOptions = {
		headerTransparent: true
	}

	handleLogin = () => {
		return new Promise(async (resolve, reject) => {
			let { username, password, masterSecretID, DID } = this.state
			const url = `${serverIP}login?id=${username}&key=${password}&did=${DID}&masterDid=${masterSecretID}`
			await fetch(url)
				.then(response => response.json())
				.then(response => {
					console.log(response)
					if (response.masterSecretId == this.state.masterSecretID) {
						resolve(true)
					} else {
						alert('Error loggin in.')
						resolve(false)
					}
				})
				.catch(err => {
					console.log(err)
					alert('Error logging in.')
					resolve(false)
				})
		})
	}

	render() {
		return (
			<LinearGradient colors={['#f0f0f0', '#f0f0f0']} style={styles.container}>
				<KeyboardAvoidingView
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center'
					}}
					behavior='padding'
				>
					{/* <View style={styles.three}>
						<Three width={300} height={300} />
					</View>
					<View style={styles.spots}>
						<Spots width={100} height={100} />
					</View> */}

					<StatusBar barStyle='light-content' />

					<View style={styles.centered}>
						<Header title='Prover Login' />
					</View>
					<View style={styles.inputContainer}>
						<InputText
							title='Username'
							value={this.state.username}
							onChangeText={username => this.setState({ username })}
						/>
					</View>
					<View style={styles.inputContainer}>
						<InputPassword
							title='Password'
							value={this.state.password}
							onChangeText={password => this.setState({ password })}
						/>
					</View>
					<View style={styles.inputContainer}>
						<InputDID
							title='Your DID'
							value={this.state.DID}
							onChangeText={DID => this.setState({ DID })}
						/>
					</View>
					<View style={styles.inputContainer}>
						<InputMID
							title='Your Master Secret ID'
							value={this.state.masterSecretID}
							onChangeText={masterSecretID => this.setState({ masterSecretID })}
						/>
					</View>

					<MyButton
						title='Submit'
						onPress={async next => {
							const res = await this.handleLogin()
							next()
							if (res) {
								this.props.navigation.navigate('ReadQR', {
									username: this.state.username,
									password: this.state.password,
									DID: this.state.DID,
									masterSecretID: this.state.masterSecretID
								})
							}
						}}
					/>
				</KeyboardAvoidingView>
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	centered: {
		marginTop: 50,
		marginBottom: -10,
		alignItems: 'center',
		width: 300
	},
	inputContainer: {
		marginTop: 20,
		paddingLeft: 45,
		paddingRight: 45,
		width: '100%',
		height: 50
	},
	image: {
		width: 300,
		height: 200,
		resizeMode: 'contain',
		marginTop: 50
	},

	blob: {
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor: '#f0f0f0',
		width: '100%',
		height: 680,
		borderBottomLeftRadius: 35,
		borderBottomRightRadius: 35

		// zIndex: -1
	},
	three: {
		position: 'absolute',
		left: -40,
		bottom: -140
	},
	spots: {
		position: 'absolute',
		right: 0,
		top: 0
	}
})

export default Login
