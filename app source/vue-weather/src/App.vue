<template>
   <the-header 
		:city-list="cityList"
		:unit="currentUnit" 
		:current-city="currentCity"
		@get-weather="getWeather"
		@change-current-city="changeCurrentCity"
		@get-location="cloudflare"
	></the-header>
	<the-weather 
		:temp="currentWeather.temp" 
		:about="currentWeather.about"
		:icon="currentWeather.icon"
		:sunrise="currentWeather.sunrise"
		:sunset="currentWeather.sunset"
	></the-weather>
	<the-footer 
		:wind="currentWeather.wind" 
		:pressure="currentWeather.pressure"
		:humidity="currentWeather.humidity"
		:rain="currentWeather.rain"
		:unit="currentUnit"
	></the-footer>
</template>

<script>
import 'normalize.css/normalize.css'
import './styles/scss/main.scss'
import TheHeader from "./components/TheHeader"
import TheWeather from "./components/TheWeather"
import TheFooter from "./components/TheFooter"

export default {
   name: "App",
   components: {
      TheHeader,
		TheWeather,
		TheFooter
   },
	data() {
		return {
			// dont use him, po bratski
			API_KEY: '5718557635dd05ca409473548785ebc2', // https://openweathermap.org/api
			INTERVAL_UPDATE: 300000, // 5min (300000)
			currentUnit: 'metric', // metric - (C), imperial - (F)
			cityList: ['Краснодар', 'Москва', 'Омск', 'Хабаровск', 'Красноярск', 'Мыло'],
			currentCity: '',
			memberIp: null,
			currentWeather: {},
			currentLat: 0,
			currentLon: 0
		}
	},
	mounted() {
		this.cloudflare(),

		// мдэ -__-
		setTimeout(() => {
			setInterval(this.getWeather, this.INTERVAL_UPDATE)
		}, this.INTERVAL_UPDATE)
	},
	methods: {
		async cloudflare() {
			const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
			const data = await response.text()
			const ip = data.match(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/)[0]

			this.memberIp = ip
			this.getMemberLocation()
		},
		async getMemberLocation() {
			const response = await fetch(`https://saymeowmeow.gq/projects/apps/vue-weather/getLocation.php?ip=${this.memberIp}`, {method: 'GET'})
			const data = await response.json()

			this.currentLat = data.latitude
			this.currentLon = data.longitude
			this.getWeather()
		},
		async getWeather(unit = null, changeCity = false) {
			this.currentUnit = !unit ? this.currentUnit : unit

			// добавляем класс анимации
			if (!document.body.classList.contains('loading')) {
				this.animationLoadingData()
			}

			try {
				const urlBase = 'https://api.openweathermap.org/data/2.5/'
				const url = !changeCity ? 
				`${urlBase}forecast?lat=${this.currentLat}&lon=${this.currentLon}&units=${this.currentUnit}&lang=ru&appid=${this.API_KEY}`
				: `${urlBase}forecast?q=${this.currentCity}&units=${this.currentUnit}&lang=ru&appid=${this.API_KEY}`

				const response = await fetch(url)

				if (response.status === 404 || !response.ok) {
					alert('Упс... Кажется вы ошиблись в названии города')
					this.animationLoadingData()
					this.currentCity = this.cityList[0]
					return
				}

				const data = await response.json()

				this.currentCity = data.city.name
				this.currentWeather = {
					temp: data.list[0].main.temp,
					about: data.list[0].weather[0].description,
					icon: data.list[0].weather[0].icon,
					wind: data.list[0].wind,
					rain: data.list[0].rain,
					pressure: data.list[0].main.pressure, // давление
					humidity: data.list[0].main.humidity, // влажность
					sunrise: data.city.sunrise,
					sunset: data.city.sunset,
				}

				// удаляем класс анимации
				this.animationLoadingData()
			} catch (error) {
				console.error(error)
			}
		},
		changeCurrentCity(newCity) {
			this.currentCity = newCity
			this.getWeather(null, newCity)
		},
		animationLoadingData() {
			document.body.classList.toggle('loading')
			
			if (this.currentWeather.sunset && (new Date().getTime() / 1000).toFixed() > this.currentWeather.sunset) {
				document.querySelector('html').dataset.theme = 'dark'
			}
		}
	}
};
</script>
