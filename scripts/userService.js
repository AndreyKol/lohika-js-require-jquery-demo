/**
 * Created by acolodnitchii on 2/13/2015.
 */
define(["jquery"], function($){

    var baseUrl = "https://lohika-js-course.herokuapp.com/User";
    var userIdTemplate = _.template(baseUrl+"/<%= id %>");

   return{
       add : addUser,
       getAll : getAll,
       getById: getById,
       delete: deleteUser,
       update: updateUser
    };

    function updateUser(user){
        return executeRequest(userIdTemplate({id: user.id}), "PUT", user);
    }

    function deleteUser(userId){
        return executeRequest(userIdTemplate({id: userId}), "DELETE");
    }

    function getById(userId){
        return executeRequest(userIdTemplate({id: userId}), "GET");
    }

    function getAll(){
        return executeRequest(baseUrl, "GET");
    }

    function addUser(user){
        return executeRequest(baseUrl, "POST", user);
    }

    function executeRequest(url, type, data){
        return $.ajax({
            type:type,
            dataType: "json",
            contentType:"application/json",
            url: url,
            data: JSON.stringify(data)
        });
    }
});