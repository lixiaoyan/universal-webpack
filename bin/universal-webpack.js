#!/usr/bin/env node

var path = require('path')
var fs = require('fs')

var minimist = require('minimist')
var universal_webpack = require('../index.common')

var command_line_arguments = minimist(process.argv.slice(2))

if (!command_line_arguments.settings)
{
	return usage('Path to the settings file not specified')
}

var settings = require(path.resolve(process.cwd(), command_line_arguments.settings))

var webpack_configuration

if (command_line_arguments.config)
{
	webpack_configuration = require(path.resolve(process.cwd(), command_line_arguments.config))
}

if (command_line_arguments._.length === 0)
{
	return usage('No command specified')
}

if (command_line_arguments._.length > 1)
{
	return usage('Invalid input')
}

var command = command_line_arguments._[0]

switch (command)
{
	case 'prepare':
		universal_webpack.prepare(settings, webpack_configuration)
		break

	default:
		usage('Unknown command: ' + command)
}

function usage(reason)
{
	if (reason)
	{
		console.log(reason)
		console.log('')
	}

	console.log('Usage:')
	console.log('')
	console.log('universal-webpack --settings ./universal-webpack-settings.js <command>')
	console.log('')
	console.log('Commands:')
	console.log('')
	console.log('   prepare - Creates (or cleans) the server-side build folder')
	console.log('             ')
	console.log('             That\'s needed because Nodemon, for example,')
	console.log('             needs the folder to exist by the time it runs,')
	console.log('             otherwise it won\'t detect any changes to the code')
	console.log('             in that "--watch"ed folder and therefore won\'t')
	console.log('             restart the server on code changes.')
	console.log('             ')
	console.log('             An optional --config flag may be specified')
	console.log('             in which case `context` will be read from this webpack config')
	console.log('             and will be used to resolve the paths in')
	console.log('             `./universal-webpack-settings.js` which are resolved')
	console.log('             from `process.cwd()` by default.')

	if (reason)
	{
		return process.exit(1)
	}

	process.exit(0)
}