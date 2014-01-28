(function() {
    $('.challenger').on('click', function(ev) {
        ev.preventDefault();
        var $me = $(this);
        sendRequest($me.attr('data-id'), $me.attr('data-name'));
    });
    
    function sendRequest(id, name) {
        FB.ui({method: 'apprequests',
            title: 'Hey! I started a game against you on CheSS.js',
            to: id,
            message: 'Hey '+name+', I\'ll beat you!',
        }, function(response) {
            if ((response) && (response.request)) {
                window.location = '/chess/create/'+response.request+'/'+id;
            }
        });
    };

    $('.users-box .form-search').on('keyup', '.search-input', function() {
        var $me = $(this);
        var $userBox = $me.parents('.users-box');
        var val = $me.val();
        
        if (!val) {
            $userBox.find('li[data-name]').show();
        } else {
            $userBox.find('li[data-name]').hide();
            $userBox.find('li[data-name*="'+val.toLowerCase()+'"]').show();
        }
    });
    
    var checkGames = function() {
        $.ajax({
            url:'/chess/_/checkGames',
            type: 'POST',
            success: function(response) {
                for(var i = 0, x = response.length; i < x; i++) {
                    if ($('#'+response[i]).length === 0)
                        window.location.reload();
                }
            }
        });
    };

    setInterval(checkGames, 5000);
})();