var site = "https://fathomless-woodland-51903.herokuapp.com"

$(document).ready(function(){
/*
  data.forEach(function(item) {
    var to_do = $(`<li>
    ${item.attributes.todo}<input type="checkbox" class="checkbox" ${item.attributes.isComplete ? "checked" : ""}>
    <button type="button" name="button" class="delete">Delete</button>
    </li>`);

    $("#to_do_list").append(to_do);
  })
*/



  $.getJSON({
    url: `${site}/todos`,
    headers: {
      "Authorization": "Token token=supadupasecret"
    },
    success: (response) => {
      console.log($(response));

      var todoHTML = response.data.map((item) => `<li data-id=${item.id}>
      ${item.attributes.todo}<span><input type="checkbox" class="checkbox" ${item.attributes['is-complete'] ? "checked" : ""}>
      <button type="button" name="button" class="delete">Delete</button></span>
      </li>`);

      $("#to_do_list").append(todoHTML);

      var countChecked = function() {
        var n = $("li").length - $("input:checked").length;
        $( "#tasks_left" ).text( n + " tasks" + (n === 1 ? " is" : " are") + " left to do!" );
      };
      countChecked();
      $( "input[type=checkbox]" ).on( "click", countChecked );

      }
  });


  $("form").submit(function(event){

    $.post({
      url: `${site}/todos`,
      headers: {
        "Authorization": "Token token=supadupasecret"
      },
      data: $(this).serialize(),
      success: function(response){
        $("#to_do_list li:last").data("id", response.data.id)
      }

    })



    var todoHTML = `<li>${$(this).find("input").val()}<input type="checkbox">
    <button type="button" name="button" class="delete">Delete</button>
    </li>`;
    $("#to_do_list").append(todoHTML);

    $("input").val("");
    event.preventDefault();

    var countChecked = function() {
      var n = $("li").length - $("input:checked").length;
      $( "#tasks_left" ).text( n + " tasks" + (n === 1 ? " is" : " are") + " left to do!" );
    };
    countChecked();
    $( "input[type=checkbox]" ).on( "click", countChecked );


  })

  $("#to_do_list").on("click", ".delete", function(event){
    var that = $(this);
    $.ajax({
      url: `${site}/todos/${that.parent().data("id")}`,
      type: "DELETE",
      headers: {
        "Authorization": "Token token=supadupasecret"
      },
      success: function(data){
        that.parent().remove()
      }
    })
  })


  $("#to_do_list").on("change", ".checkbox", function(event) {
        var item = $(event.target).parent()
        var isItemCompleted = item.hasClass("completed")
        var itemId = item.attr("data-id")
        console.log("clicked item " + itemId + ", which has completed currently set to " + isItemCompleted);

        var updateRequest = $.ajax({
            type: "PUT",
            url: `${site}/todos/` + itemId,
            headers: {
                "Authorization": "Token token=supadupasecret"
            },
            data: {
                todo: {isComplete: !isItemCompleted}
            }
        })

        updateRequest.done(function(itemData) {
            if (itemData.data.attributes["is-complete"]) {
                item.addClass("completed")
            } else {
                item.removeClass("completed")
            }
        })


    })



})
