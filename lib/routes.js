let app = module.parent.exports;
const emitter = app.emitter;

(()=> {

	// Index
	app.get(/^\/chess\/?$/, (req, res) => {
	    app.getControl('index', req, res);
	});

	// Ajax
	app.post('/chess/_/:action', (req, res) => {
		app.checkUser(req.session.meFB.id, (dbUser) => {
            req.session.me = dbUser;
            
            const params = req.body;
			params.action = req.params.action;

			app.getControl('ajax', req, res, params);
        });
	});

	// Views
	app.get(/^\/chess\/?(.*)/, app.facebookLogin(), (req, res) => {
	    if (req.params[0] === undefined) {
	        const params = [];
	    } else {
	        const params = req.params[0].split('/');
	        if (params[0] === '')
	            params = params.slice(1);
	        if (params[params.length-1] === '')
	            params = params.slice(0,params.length-1);
	    }

	    const control = 'index';

	    if (params[0])
	        control = params[0];

	    req.facebook.api('/me?fields=id,name,picture,friends.fields(id,name,picture)', (err, me) => {
	        if (!me.friends)
	            me.friends = {data:[]};
	        
	        req.session.meFB = me;
	        
	        app.checkUser(req.session.meFB.id, (dbUser) => {
	            req.session.me = dbUser;

	            app.getControl(control, req, res, params.slice(1));
	        });
	    });
	});
	
})();