# CheSS.js

Chess developed in HTML, CSS and Javascript, created and maintained by [Thiago Genuino](https://twitter.com/tgenuino) and [Felipe Fialho](http://www.felipefialho.com/)..

### [Play the game!](http://chessjs.trendi.com.br/chess)

## Getting Started

####Install NodeJS

[Install NodeJS and npm] (http://nodejs.org/)

####Install MongoDB

[Install MongoDB] (http://www.mongodb.org/)

####Install Grunt

[Install Grunt] (http://gruntjs.com/)

### Install the project

Clone the project and install dependencies

	git clone https://github.com/chessjs/chess
	cd chess
	npm install
	cd public
	npm install

## Assets of project

The 'assets' of project, are in 'public'	

You'll have something like this:

```
public/
└── dev/
		└── assets/
				├── css/
				│   ├── less/
				│   │ 	├── _bootstrap/* 
				│   │ 	├── components/* 
				│   │ 	├── game.less
				│   │ 	├── project.less
				│   │		└── style.less
				│   ├── icons/* 
				│   └── style.css 
				└──  js/ 
				   	 └── _scripts/* 
```

You need only change the `components/*` `*.less` and `_script/*`...

### For watch CSS and JavaScript
 
 	cd public/
	grunt w
   
Start hacking away! 
 