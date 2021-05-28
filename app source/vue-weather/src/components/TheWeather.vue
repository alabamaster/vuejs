<template>
	<main>
		<div class="container">
			<div class="weather">
				<div class="weaher-icon" v-html="setBootstrapIcon"></div>
				<div class="weather-temp">
					<span>{{ !temp ? 0 : temp.toFixed() }}</span>
					<span>º</span>
				</div>
			</div>
			<div class="weather-about">{{ about }}</div>
		</div>
	</main>
</template>

<script>
export default {
	props: {
		temp: {
			type: Number,
			required: true,
			default: 0
		},
		about: {
			type: String,
			required: true,
			default: 'Загружается ...'
		},
		icon: {
			type: String,
			required: true,
			default: '01d'
		},
		iconGroupId: {
			type: Number,
			required: true,
			default: 800
		},
		sunrise: {
			type: Number,
			required: true,
			default: 0
		},
		sunset: {
			type: Number,
			required: true,
			default: 0
		}
	},
	computed: {
		setBootstrapIcon() {
			const theNight = (new Date().getTime() / 1000).toFixed() > this.sunset
			const dayOrNight = 'var(--white-color)'
			// const iconCod = this.icon.slice(0, -1)
			const gid = this.iconGroupId
			let icon

			// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
			const listIcons = [
				// гроза и дождь
				{ids: [200, 201, 202, 230, 231, 232], iconD: '<i class="bi bi-cloud-lightning-rain"></i>', iconN: ''},
				// просто гроза
				{ids: [210, 211, 212, 221], iconD: '<i class="bi bi-cloud-lightning"></i>', iconN: ''},
				// морось и дожь
				{ids: [300, 301, 302, 310, 311, 312, 313, 314, 321], iconD: '<i class="bi bi-cloud-drizzle"></i>', iconN: ''},
				// небольшой дождь
				{ids: [500, 501], iconD: '<i class="bi bi-cloud-rain"></i>', iconN: ''},
				// сильный дождь
				{ids: [502, 503, 504, 511, 520, 521, 522, 531], iconD: '<i class="bi bi-cloud-rain-heavy"></i>', iconN: ''},
				// снег
				{ids: [600, 601, 602, 620, 622], iconD: '<i class="bi bi-cloud-snow"></i>', iconN: ''},
				// мокрый снег
				{ids: [611, 612, 613, 615, 616, 621], iconD: '<i class="bi bi-cloud-sleet"></i>', iconN: ''},
				// туман
				{ids: [701, 711, 721, 731, 741, 751, 761, 762, 771], iconD: '<i class="bi bi-cloud-haze-1"></i>', iconN: ''},
				// торнадо
				{ids: [781], iconD: '<i class="bi bi-tornado"></i>', iconN: ''},
				// ясно
				{ids: [800], iconD: '<i class="bi bi-brightness-high"></i>', iconN: '<i class="bi bi-moon"></i>'},
				// мало облаков: 11-25%
				{ids: [801], iconD: '<i class="bi bi-cloud-sun"></i>', iconN: '<i class="bi bi-cloud-moon"></i>'},
				// рассеянные облака: 25-50%
				{ids: [802], iconD: '<i class="bi bi-cloudy"></i>', iconN: '<i class="bi bi-cloud-moon"></i>'},
				// 803 - разорванные облака: 51-84% / 804 пасмурная облачность: 85-100%
				{ids: [803, 804], iconD: '<i class="bi bi-clouds"></i>', iconN: '<i class="bi bi-cloud-moon"></i>'},
			]


			const iconObj = listIcons.find(obj => {
				return obj.ids.find(itemB => itemB === gid)
			})
	
			return !theNight ? iconObj.iconD : (!iconObj.iconN.length ? iconObj.iconD : iconObj.iconN)
		},
		setOpenWeatherIcon() {
			return `<img src="https://openweathermap.org/img/wn/${this.icon}@4x.png" style="filter: brightness(2);" alt="${this.about}" />`
		}
	}
}
</script>
