/**
 * @file Imports all the external dependencies
 *
 * @author Thomas Richner (thomasrichner@oviva.ch)
 *
 * In case a package is added to the package.json it also needs to be imported here.
 * Some npm packages do not specify a proper 'main' inside their package.json or omit
 * styles, therefore it can be necessary to import files in packages explicitly.
 *
 * In case of explicit imports the un-minified but bundled version is preferred.
 *
 */
import 'angular'

import 'angular-animate'
import 'angular-aria'
import 'angular-cookies'

import 'angular-material'
import 'angular-material/angular-material.css'

import 'angular-ui-router'

import 'angular-translate'
import 'angular-translate-loader-static-files'
