<template>
	<footer>
		<div class="container">
			<div class="wrap-statistic">
				<ul class="statistic-list">
					<li class="statistic-item">
						<div class="item-title">Ветер</div>
						<div class="item-value">{{ wind.speed.toFixed() }} м/c, {{ dirToStr(wind.deg) }}</div>
					</li>
					<li class="statistic-item">
						<div class="item-title">Давление</div>
						<div class="item-value">{{ c_pressure }}</div>
					</li>
					<li class="statistic-item">
						<div class="item-title">Влажность</div>
						<div class="item-value">{{ humidity }}%</div>
					</li>
					<li class="statistic-item">
						<div class="item-title">Вероятность дождя</div>
						<div class="item-value">{{ c_rain }}%</div>
					</li>
				</ul>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	props: {
		wind: {
			type: Object,
			required: true,
			default: {
				'speed': 0,
				'deg': 0,
				'gust': 0
			}
		},
		pressure: {
			type: Number,
			required: true,
			default: 0
		},
		humidity: {
			type: Number,
			required: true,
			default: 0
		},
		rain: {
			type: Object,
			required: true,
			default: {'3h': 0}
		},
		unit: {
			type: String,
			required: true,
			default: 'metric'
		}
	},
	methods: {
		dirToStr(d) {
			const directions = ['северный', 'северо-восточный', 'восточный', 'юго-восточный', 'южный', 'юго-западный', 'западный', 'северо-западный'];
			d = d < 0 ? 
				d = 360 - Math.abs(d) % 360 
			: d % 360;
			return `${directions[d / 45 | 0]}`;
		}
	},
	computed: {
		c_rain() {
			if (!this.rain['3h']) {
				return 0
			} else if(this.rain === 1 || this.rain === 100) {
				return 100
			} else {
				return this.rain['3h'].toString().replace(/^0\./, '')
			}
		},
		c_pressure() {
			return this.unit === 'metric' ? Math.floor(this.pressure * 3/4) + ' мм рт. ст.' : this.pressure + ' гПа'
		}
	}
}
</script>
