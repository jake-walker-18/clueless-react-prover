import React from 'react'

import { StyleSheet, Text, View, StatusBar, Button } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { primaryGradientArray } from '../utils/Colors'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { serverIP } from '../utils/Config'

import Header from '../components/Header.js'

import B from './../assets/svgs/thirdB.svg'

class ReadQR extends React.Component {
	static navigationOptions = {
		headerTransparent: true
	}

	state = { proof: [] }

	getProof = async (username, password, DID, masterSecretID, data) => {
		return new Promise(async (resolve, reject) => {
			console.log(data)
			let proofjson = JSON.parse(data)
			let proofType = proofjson.proof
			proofType = proofType.trim() //proofType.toString().trim() might work for trimming the whitespace
			const url = `${serverIP}credentials-for-default-proof?masterSecretId=${masterSecretID}&proverWalletID=${username}&proverDID=${DID}&proof=${proofType}&proverWalletKey=${password}`
			await fetch(url)
				.then(response => response.json())
				.then(response => {
					let json = JSON.stringify(response)
					console.log(json)
					this.setState({ proof: json })
					resolve(true)
				})
				.catch(err => {
					alert('Something went wrong. Try again.')
					resolve(false)
				})
		})
	}

	render() {
		const { navigation } = this.props
		const username = navigation.getParam('username', 'default username')
		const password = navigation.getParam('password', 'default password')
		const DID = navigation.getParam('DID', 'default DID')
		const masterSecretID = navigation.getParam(
			'masterSecretID',
			'No MID was passed here'
		)
		return (
			<LinearGradient colors={['#f0f0f0', '#f0f0f0']} style={styles.container}>
				<View
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				>
					<StatusBar barStyle='light-content' />

					<BarCodeScanner
						onBarCodeScanned={async ({ data }) => {
							console.log('scanned something')

							const res = await this.getProof(
								username,
								password,
								DID,
								masterSecretID,
								data
							)
							console.log('got res')
							if (res) {
								this.props.navigation.navigate('ShowQR', {
									username: username,
									password: password,
									DID: DID,
									masterSecretID: masterSecretID,
									proof: this.state.proof
								})
							}
						}}
						style={styles.camera}
					/>
				</View>
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	centered: {
		alignItems: 'center',
		width: '100%'
	},
	inputContainer: {
		marginTop: 40,
		paddingLeft: 15,
		width: '100%',
		height: 50
	},
	camera: {
		width: 1000,
		height: 1000
	},

	B: {
		position: 'absolute',
		right: 0,
		top: 0
	}
})

export default ReadQR
