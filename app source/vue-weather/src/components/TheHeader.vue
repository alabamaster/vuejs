<template>
	<header>
		<div class="container">
			<div class="wrap-header">
				<div class="city">
					<div class="wrap-search">
						<form id="search-city-form" @submit.prevent="goSearch(searchQuery)">
							<div class="city-search" :class="{show: searchIsActive}">
								<input 
									type="text" 
									placeholder="Введите город" 
									class="city-search_input" 
									@input="submitSearch"
									v-model="searchQuery"
								>
								<button type="submit" class="city-search_btn">ОК</button>
							</div>
						</form>

						<div class="search-list" v-if="showSearchResults && searchQuery.length > 0">
							<div 
								class="search-item" 
								v-for="item in searchResultArr" 
								:key="item"
								@click="selectNewCity(item)"
							>{{ item }}</div>
						</div>
					</div>
					
					<div id="wrap-city" :class="{hide: searchIsActive}">
						<div class="current-city">{{ currentCity }}</div>
						<div class="city-buttons">
							<button class="btn city-buttons_btn" @click.prevent="toggleSearchActive">
								<span>Сменить город</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 18 18">
									<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
								</svg>
							</button>
							<button class="btn city-buttons_btn" @click="$emit('get-location')">
								<img src="../assets/location.svg" alt="My location">
								<span>Мое местоположение</span>
							</button>
						</div>
					</div>
				</div>
				<div class="wrap-metric">
					<div class="metric" @click="toggleUnit">
						<button class="btn metric_btn" :class="{ active: thisIsUnit == 'metric' }">C</button>
						<button class="btn metric_btn" :class="{ active: thisIsUnit == 'imperial' }">F</button>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	props: {
		cityList: {
			type: Array,
			required: true
		},
		unit: {
			type: String,
			required: true,
			default: 'metric'
		},
		currentCity: {
			type: String,
			required: true,
			default: ''
		}
	},
	data() {
		return {
			thisIsUnit: this.unit,

			searchIsActive: false,
			searchResultArr: [],
			showSearchResults: false,
			searchQuery: ''
		}
	},
	methods: {
		toggleSearchActive() {
			this.searchIsActive = !this.searchIsActive
		},
		toggleShowSearchResult() {
			this.showSearchResults = !this.showSearchResults
		},
		toggleUnit() {
			this.thisIsUnit == 'metric' ? this.thisIsUnit = 'imperial' : this.thisIsUnit = 'metric'
			this.$emit('get-weather', this.thisIsUnit, true)
		},

		// search, input event
		submitSearch() {
			this.showSearchResults = true

			this.searchResultArr.forEach((item, idx) => {
				if (item.search(this.searchQuery) === -1) {
					this.searchResultArr.splice(idx, 1)
				}
			})
			
			this.cityList.forEach((item, idx) => {
				if (item.search(this.searchQuery) > -1) {
					this.searchResultArr.push(item)
				} else {
					this.searchResultArr.splice(idx, 1)
				}
			})

			// удаление дублей из массива
			this.searchResultArr = this.searchResultArr.filter((item, idx) => {
				return this.searchResultArr.indexOf(item) === idx
			})
		},
		goSearch(city) {
			this.$emit('change-current-city', city)
			this.toggleSearchActive()
			this.showSearchResults = false
		},
		selectNewCity(city) {
			this.searchQuery = city
			this.toggleShowSearchResult()
		}
	}
}
</script>
