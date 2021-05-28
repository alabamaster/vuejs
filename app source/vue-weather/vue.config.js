// vue.config.js
// https://cli.vuejs.org/ru/config/

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	productionSourceMap: false,
}
