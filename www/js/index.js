
var localDB = new PouchDB('local')
var remoteDB
var syncComp = false;

(function () {
    $(document).on('deviceready',function () {
        loginUI()
    })
})()

function loginUI () {
    $('<div>').css('flex','1').attr('id','idDiv').appendTo('.app')
    $('<div>').addClass('logo').appendTo('#idDiv')
    $('<div>').addClass('login').css('flex','1').appendTo('.app')
    $('<h3>').text('login').appendTo('.login')
    $('<input>').attr({'id':'user','placeholder':'Username'}).appendTo('.login')
    $('<input>').attr({'id':'pw','type':'password','placeholder':'Password'}).appendTo('.login')
    $('<input>').attr({'id':'retypePW','type':'password','placeholder':'Retype Password'}).addClass('hide').appendTo('.login')
    $('<button>').attr('id','login').text('Login').appendTo('.login')
    $('<button>').attr('id','newUser').text('New User').appendTo('.login')
    $('<button>').attr('id','createNewUser').addClass('hide').text('Create New User').appendTo('.login')

    $('#newUser').on('click',function () {
        $('#retypePW, #createNewUser').removeClass('hide')
        $('#newUser, #login').addClass('hide')
    })

    $('#login').on('click',function () {
        login()
    })

    $('#createNewUser').on('click', function () {

    })

}

function login () {
    console.log('login')
    remoteDB = new PouchDB ('https://couchdb-917b36.smileupps.com/' + $('#user').val())
    remoteDB.login($('#user').val(), $('#pw').val(), function (err, response) {
        if (err) {
            if (err.name === 'unauthorized') {
                alert('Login Failed (01)')
                return
            } else {
                console.log('try local DB')
                localDB.login($('#user').val(), $('#pw').val(), function (err, response) {
                    if (err) {
                        if (err.name === 'unauthorized') {
                            alert('Login Failed (01)')
                            return
                        } else {
                            alert('Login Failed (02)')
                            return
                        }
                    }
                    console.log(response)
                    sync()
                    main(response.name)
                });
                return
            }

        }
        console.log(response)
        sync()
        main(response.name)

    });
}

function main (name) {
    clear('.app')
    drawHeader(name)
    $('<div>').addClass('appBody').appendTo('.app')
    listRecipes('show_all')
}

function listRecipes (option) {
    var db
    if (syncComp == true) {
        db = localDB
    }else{
        db = remoteDB
    }
    db.query(option,function (err, response) {
        if (err) {
            console.log(err)
        }
        for (var i = 0; response.rows.length > i; i++) {
            $('<a id=' + response.rows[i].id + '><h3>'+ response.rows[i].value +'</h3></a>').appendTo('.appBody')
        }
    })
}

function sync () {
    localDB.sync(remoteDB).on('complete', function () {
        console.log('yay, were in sync!')
        syncComp = true
    }).on('error', function (err) {
        console.log('sync error!')
    });
}

function clear (div) {
    $(div + '>').remove()
}

function drawHeader(name) {
    $('<div>').addClass('header').appendTo('.app')
    $('<a class="menuBtn flex-col iconSize" href="javascript:void(0)"> </a>').appendTo('.header')
    $('<div>').addClass('headerText').appendTo('.header')
    $('<a class="plusBtn flex-col iconSize" href="javascript:void(0)"> </a>').appendTo('.header')
    $('<h3>').text(name).appendTo('.headerText')
    $('<div class="line"></div><div class="line"></div><div class="line"></div>').appendTo('.menuBtn')
    $('<p>').text('+').appendTo('.plusBtn')
} 