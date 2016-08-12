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
      var todoHTML = response.data.map((item) => `<li data-id=${item.id}>
      ${item.attributes.todo}<input type="checkbox" class="checkbox" ${item.attributes.isComplete ? "checked" : ""}>
      <button type="button" name="button" class="delete">Delete</button>
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



    var todoHTML = `<li>${$(this).find("input").val()}<input type="checkbox" ${this.attributes.isComplete ? "checked" : ""}>
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

  $("#to_do_list").on("change", ".checkbox", function(event){
    console.log("checked");
    var that = $(this);
    $.ajax({
      url: `${site}/todos/${that.parent().data("id")}`,
      type: "PUT",
      headers: {
        "Authorization": "Token token=supadupasecret"
      },

      success: function(data){
        console.log(data);
        console.log(that);
        if (that.prop("checked")) {
          
        } else {
          console.log("uncheck this item");
          that.parent().remove()
        }

      }
    })
  })

})
