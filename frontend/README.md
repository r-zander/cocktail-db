# Contentful Angular Rendering

This displays content delivered by the headless CMS [Contentful](https://www.contentful.com/) in Googles Material Design.  
The app is intended to be used both on desktop and smartphones (and anything in between).

**Author:** Raoul Zander <raoulzander@oviva.com>

## Technology

This project is built ontop of:
- ES6 (transpiled with babel 6.24)
- angular 1.5 with ui-router 1.0 and material 1.1
- Sass CSS precompiler
- yarn package manager
- gulp
- webpack bundler

## Setup

### Yarn
Install the `yarn` package manager
```
~> brew install yarn
```

Alternatively:
```
~> npm install -g yarn
```

### Gulp
Install `gulp`
```
~> npm install -g gulp
```

### Dependencies
Install dependencies
```
~> yarn
```

Alternatively:
```
~> yarn install --flat
```

## Build
Build the binary
```
~> gulp
```

Run a local instance for development
```
~> gulp serve
```

## Deployment

1. Use the release tag of the frontend repository (eg. release/v314)
2. Use [this jenkins job](https://lithium.ovivacoach.com/jenkins/job/cms_build_and_historize/) to build and historize the cms from branch
3. Download the jenkins artifact [https://lithium.ovivacoach.com/jenkins/job/cms_build_and_historize/lastSuccessfulBuild/artifact/]
4. Connect to lithium.tun
5. Move the files to `sftp://www.oviva.com:2222/var/www/ovivacoach.com/htdocs-<tag>`, either via a app like CyberDuck or `scp` command line
6. Assert the permissions are in mode `644` and owned by `www-data:www-data`, otherwise use `chown -R www-data:www-data htdocs-<tag>`.
7. Adjust the symlink `/var/www/ovivacoach.com/htdocs` to point to the new release `ln -sf htdocs-<tag> htdocs`

