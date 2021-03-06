
$(document).ready(function(){
    
    var info       = $('.info');
    var infodelete = $('.info-delete');
    var $_token = $('#token').val();

    $('.open-modal').click(function(){
        info.hide().find('ul').empty();
        var id = $(this).val();
        $.get('branch/edit' + '/' + id, function (data) {
            $('#id').val(data.id);
            $('#name').val(data.name);
            $('#description').val(data.description);
            $('#address').val(data.address);
            $('#city').val(data.city);
            $('#zip_code').val(data.zip_code);
            $('#phone').val(data.phone);
            $('#type').val(data.type);
            $('.save').val("update");
            $('#myModal').modal('show');
        }) 
    });

    $('#btn-add').click(function(){
        $('.save').val("add");
        $('#frm').trigger("reset");
        info.hide().find('ul').empty();
        $('#myModal').modal('show');
    });

    $('.delete').click(function(){
        var id = $(this).val();
        if(bootbox.confirm('Are you sure want to delete this data?', function(result)
        {
            console.log(result);
            if(result == true)
            {
                $.ajax({
                    type: "POST",
                    headers: { 'X-XSRF-TOKEN' : $_token }, 
                    url: 'branch/delete' + '/' + id,
                    success: function (data) {
                        
                        infodelete.hide().find('ul').empty();
                        if(data.success == false)
                        {
                            infodelete.find('ul').append('<li>'+data.errors+'</li>');
                            infodelete.slideDown();
                            infodelete.fadeTo(2000, 500).slideUp(500, function(){
                               infodelete.hide().find('ul').empty();
                            });   
                        }
                        else
                        {
                            $("#branch" + id).remove();
                            
                        }
                    },
                });
                return true;
            }
            
        }));
    });

    $(".save").click(function (e) {
        e.preventDefault();
        var state = $('.save').val();
        var id = $('#id').val();
        var url = 'branch/store';

        if (state == "update"){
            url  = 'branch/update/' + id;
        }

        var formData = {
            id: $('#id').val(),
            name: $('#name').val(),
            description: $('#description').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            zip_code: $('#zip_code').val(),
            phone: $('#phone').val(),
            type: $('#type').val(),
        }

        $.ajax({

            type: 'POST',
            url: url,
            data: formData,
            dataType: 'json',
            headers: { 'X-XSRF-TOKEN' : $_token }, 
            success: function (data) {
                console.log(data);
                info.hide().find('ul').empty();
                    
                if(data.success == false)
                {
                    console.log(url);
                    $.each(data.errors, function(index, error) {
                        info.find('ul').append('<li>'+error+'</li>');
                    });

                    info.slideDown();
                    info.fadeTo(2000, 500).slideUp(500, function(){
                       info.hide().find('ul').empty();
                    });
                }
                else
                {
                    var branch = '<tr id="branch' + data.data.id + '"><td>' + data.data.name + '</td><td>' + data.data.address + '</td><td>' + data.data.city + '</td><td>' + data.type + '</td>';
                    branch += '<td style="text-align:center;width:15%;"><button class="btn btn-xs btn-primary open-modal" value="' + data.id + '"> <i class="glyphicon glyphicon-edit"></i> Edit</button>';
                    branch += '<button class="btn btn-xs btn-danger delete" value="' + data.id + '"><i class="glyphicon glyphicon-trash"></i> Delete</button></td></tr>';
                    
                    if (state == "add"){ 
                        $('#branch-list').append(branch);
                    }else{ 
                        $("#branch" + id).replaceWith(branch);
                    }

                    $('#frm').trigger("reset");
                    $('#myModal').modal('hide')
                }

                
            },
            error: function (data) {}
        });
    });
});

