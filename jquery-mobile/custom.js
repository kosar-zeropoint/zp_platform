$(document).ready(function(){
    var loggedin_key = window.localStorage.getItem('loggedin_key');
    var loggedin_key = 'yRtVGtTUk8ZiDYPNrbJsxq5dNMhW2XySLLsrY7TYGvQxp06oDiGOUMQ48OQo';
    // var base_url = "http://zpp.localhost/";
    var base_url = "http://android.zeropoint.it/";
    if (loggedin_key == null) {
        window.location = "#login";
    }
    else{
        window.location = "#page";
    }
    
    $("#login_button").live('click', function(event){
        get_loggedin_key();
    });

    $("#register_button").live('click', function(event){
        register();
    });

    $("#points_link").live('click', function(event){
        get_points(1);

        var page = 1;
        var page_end = "";
        var lastScrollTop = 0;

        $(document).on("scrollstop",function(){
            var height = $(this).scrollTop() + $(this).height();
            if(height / $(document).height() == 1) {
                if(window.location.hash.substr(1) == "points"){
                    if (page_end != 'end') {
                        get_points(page);
                    }
                    page++;
                }
            }

            /*var st = $(this).scrollTop();
            if (st > lastScrollTop){
                alert('downstop');
                if(window.location.hash.substr(1) == "points"){
                    if (page_end != 'end') {
                        get_points(page);
                    }
                    page++;
                }
            }

            lastScrollTop = st;*/
        });
    });

    $("#technologies_link").live('click', function(event){
        get_technologies(1);
        
        var page = 1;
        var page_end = "";
        var lastScrollTop = 0;

        $(document).on("scrollstop",function(){
            var height = $(this).scrollTop() + $(this).height();
            if(height / $(document).height() == 1) {
                if(window.location.hash.substr(1) == "technologies"){
                    if (page_end != 'end') {
                        get_technologies(page);
                    }
                    page++;
                }
            }
        });
    });
    
    $(".edit_points").live('click', function(event){
        var url = base_url + 'points/api_save/'+ event.target.id;
        
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/javascript",
            dataType: 'jsonp',
            success: function(res) {
                
                $.each(res, function(i,item){
                    html += '<li><button class="edit_points" id="'+item.id+'">I '+item.transaction_type+'</button></li>';
                });
                html += '</ul>';
                
                $('div#points div[data-role=content]').append(html);
                points_count = 1;
            },
            error: function(e) {
                $('div#points div[data-role=content]').html(e);
            }
        });
    });

    $.validator.addMethod("technology_name", function(value, element) {
        if (value == 0) {
            return false;
        };
        return true;
    }, "Technology name is required");

    $("#form_add_point_submit").validate({
        
        debug : true,
        rules: {
            point: {
                required: true
            },
            technology_id: {
                technology_name: true
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        },
        submitHandler: function() {

            $.ajax({
                type: 'GET',
                url: base_url + "points/api_post_save",
                async: false,
                jsonpCallback: 'jsonCallbackPointSave',
                contentType: "application/javascript",
                dataType: 'jsonp',
                data : $("#form_add_point_submit").serialize() + "&key="+loggedin_key,
                success: function(response_message) {
                    get_points(0);
                    window.location = "#points";
                    /*$('div#points:first').show();
                    $('div#add_point:first').hide();
                    $('#add_point_popup').popup("open");*/
                    // $('div#add_point:first').hide();
                    // $('div#points:first').show();
                    // $('#add_point_popup').popup("open");
                }
            });
        }
    });

    $("#add_point_submit").live('click', function(event){
        $("#form_add_point_submit").submit();
        return false;
    });

    $("#form_add_technology_submit").validate({
        debug : true,
        rules: {
            name: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        },
        submitHandler: function() {                        
            $.ajax({
                type: 'GET',
                url: base_url + "technology/api_post_save",
                async: false,
                jsonpCallback: 'jsonCallbackTechnologySave',
                contentType: "application/javascript",
                dataType: 'jsonp',
                data : $("#form_add_technology_submit").serialize() + "&key="+loggedin_key,
                success: function(response_message) {
                    get_technologies(1);
                    window.location = "#technologies";
                }
            });
        }
    });

    $("#add_technology_submit").live('click', function(event){
        $("#form_add_technology_submit").submit();
        return false;
    });

    get_technologies_for_select();
    
    $("#user_update").live('click', function(event){
        
        $.ajax({
            type: 'GET',
            url: base_url + "users/api_post_save",
            async: false,
            jsonpCallback: 'jsonCallbackUsersSave',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data : $("#form_user").serialize(),
            success: function(response_message) {
                window.location = "#update_info";
            }
        });
    });

    function get_loggedin_key(){
        $.ajax({
            type: 'GET',
            url: base_url + 'users/api_post_login',
            async: false,
            jsonpCallback: 'jsonCallbackLogin',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data : $("#login_form").serialize(),
            success: function(res) {
                window.localStorage.setItem('loggedin_key', res.loginkey);
                loggedin_key = res.loginkey;

                if (loggedin_key != 'error') {
                    window.location = "#page";
                    /*$('div#page:first').show();
                    $('div#login:first').hide();*/
                }
                else{
                    // window.location = "#login";
                    $('#login_failure_popup').popup("open");
                }
            },
            error: function(e) {
                $('#login_failure_popup').popup("open");
                // $('input[name=loggedin_key]').val(loggedin_key.loginkey);
            },
        });
    }

    function register(){
        $.ajax({
            type: 'GET',
            url: base_url + 'users/api_post_register',
            async: false,
            jsonpCallback: 'jsonCallbackRegister',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data : $("#register_form").serialize(),
            success: function(res) {
                $('div#login:first').show();
                $('div#register:first').hide();
                $('#register_sucess_popup').popup("open");
            },
            error: function(e) {
                $('#register_failure_popup').popup("open");
            }
        });
    }

    function get_points(page){   
        $.ajax({
            type: 'GET',
            url: base_url + 'points/api_index',
            async: false,
            jsonpCallback: 'jsonCallbackPoints',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data: {
                key : loggedin_key,
                page : page
            },
            success: function(res) {
                var points = res.points;
                if (points.length == 0) {
                    page_end = 'end';
                };

                var html = '';

                $.each(points, function(i,point){
                    html +=
                    '<tr>'+
                        '<td>'+ point.technology + '</td>'+
                        '<td>'+ point.point + '</td>'+
                    '</tr>';
                    
                });

                if (page == 1) {
                    $('div#points div[data-role=content] table tbody').html(html);
                }
                else{
                    $('div#points div[data-role=content] table tbody').append(html);
                }
            },
            error: function(e) {
                
            }
        });
    }

    function get_technologies(page){
        $.ajax({
            type: 'GET',
            url: base_url + 'technology/api_index',
            async: false,
            jsonpCallback: 'jsonCallbackTechnologies',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data: {
                key : loggedin_key,
                page : page
            },
            success: function(technologies) {
                var html = '';
                $.each(technologies, function(i,technology){
                    html +=
                    '<tr>'+
                        '<td>'+technology.technology+'</td>'+
                    '</tr>';
                });

                if (page == 1) {
                    $('div#technologies div[data-role=content]  table tbody').html(html);
                }
                else{
                    $('div#technologies div[data-role=content]  table tbody').append(html);
                }

                technologies_count = 1;
            },
            error: function(e) {
                technologies_count = 0;
            }
        });
    }

    function get_technologies_for_select(){
        $.ajax({
            type: 'GET',
            url: base_url + 'technology/api_index',
            async: false,
            jsonpCallback: 'jsonCallbackTechnologies',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data: {
                key : loggedin_key
            },
            success: function(technologies) {
                var html =' <option value="">Select Technology</option>';
                $.each(technologies, function(i,technology){
                    html += '<option value="'+technology.id+'">'+technology.technology+'</option>';
                });

                $('#technology_id').html(html);
            },
            error: function(e) {
                technologies_count = 0;
            }
        });
    }

    function get_user(){
        $.ajax({
            type: 'GET',
            url: base_url + 'users/api_save',
            async: false,
            jsonpCallback: 'jsonCallbackUserInfo',
            contentType: "application/javascript",
            dataType: 'jsonp',
            data: {
                key : loggedin_key
            },
            success: function(user) {
                var html =
                '<form method="POST" id="form_user" onsubmit="javascript:return return false;" accept-charset="UTF-8">'+
                    '<input name="_token" type="hidden" value="DO8gapU60kAbK48G2khdr59A3gSMl0bhFiWw2i3h">'+
                    '<input id="id" name="id" type="hidden" value="'+usr+'">'+
                    
                    '<label for="firstname">Firstname : </label>'+
                    '<input name="firstname" type="text" id="firstname" value="'+user.first_name+'">'+

                    '<label for="lastname">Lastname : </label>'+
                    '<input name="lastname" type="text" id="lastname" value="'+user.last_name+'">'+

                    '<label for="address">Address : </label>'+
                    '<textarea name="address" cols="50" rows="10" id="address">'+user.address+'</textarea>'+

                    '<input class="btn btn-success" type="submit" value="Update" id="user_update" name="Update">'+
                '</form>';

                $('div#update_info div[data-role=content]').append(html);

                var html =
                '<form method="POST" action=base_url + "technologies/post_save" accept-charset="UTF-8">'+
                    '<label for="username">username : </label>'+
                    '<input name="username" type="text" id="username" value="'+user.username+'">'+
                    
                    '<input class="btn btn-success" type="submit" value="Update">'+
                '</form>';

                $('div#change_username div[data-role=content]').append(html);

                var html =
                '<form method="POST" action=base_url + "technologies/post_save" accept-charset="UTF-8">'+
                    '<label for="email_address">Email Address : </label>'+
                    '<input name="email_address" type="text" id="email_address" value="'+user.email_address+'">'+

                    '<input class="btn btn-success" type="submit" value="Update">'+       
                '</form>';

                $('div#change_email_address div[data-role=content]').append(html);
            },
            error: function(e) {
                var html = "Unable to load form";
                $('div#change_username div[data-role=content]').append(html);
            }
        });
    }

    function onDeviceReady(){
    }

    $.mobile.document.on( "listviewcreate", "#technology_id-menu", function( e ) {
        var input,
            listbox = $( "#technology_id-listbox" ),
            form = listbox.jqmData( "filter-form" ),
            listview = $( e.target );

        if ( !form ) {
            input = $( "<input data-type='search'></input>" );
            form = $( "<form></form>" ).append( input );

            input.textinput();

            $( "#technology_id-listbox" )
                .prepend( form )
                .jqmData( "filter-form", form );
        }

        listview.filterable({ input: input });
    })
    .on( "pagebeforeshow pagehide", "#technology_id-dialog", function( e ) {
        var form = $( "#technology_id-listbox" ).jqmData( "filter-form" ),
            placeInDialog = ( e.type === "pagebeforeshow" ),
            destination = placeInDialog ? $( e.target ).find( ".ui-content" ) : $( "#technology_id-listbox" );

        form
            .find( "input" )
            .textinput( "option", "inset", !placeInDialog )
            .end()
            .prependTo( destination );
    });
});

$(document).bind( "mobileinit", function(){
    $.mobile.page.prototype.options.degradeInputs.date = true;
});
